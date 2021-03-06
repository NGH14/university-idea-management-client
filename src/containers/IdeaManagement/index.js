/* eslint-disable react-hooks/exhaustive-deps */
import './style.css';

import { API_PATHS, axioc, sleep, toastMessages, URL_PATHS } from 'common';
import ContentHeader from 'components/ContentHeader';
import ModalIdea from 'components/Idea/ModalIdea';
import { UimActionButtons, UimTable } from 'components/Uim';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Columns } from './model/Columns';

export default function IdeaManagement() {
	const navigate = useNavigate();
	const [data, setData] = useState();
	const [rowData, setRowData] = useState(null);

	const [pagination, setPagination] = useState({ pageSize: 5, page: 1 });
	const [tableToolBar, setTableToolBar] = useState(false);
	const [status, setStatus] = useState({
		visibleModal: false,
		action: 'update',
		loading: false,
	});

	useEffect(() => loadData(), [pagination]);

	const loadData = async () => {
		await axioc
			.get(API_PATHS.ADMIN.MANAGE_IDEA + '/table/list', {
				params: {
					page: pagination.page,
					page_size: pagination.pageSize,
				},
			})
			.catch(() => toast.error(toastMessages.errs.UNEXPECTED))
			.then((res) => setData(res?.data?.result));
	};

	const onOpenModal = (idea, action) => {
		idea && setRowData(idea);
		setStatus({ ...status, visibleModal: true, action });
	};

	const onCloseModal = () => {
		rowData && setRowData(null);
		setStatus({ ...status, visibleModal: false, action: 'create' });
	};

	const columns = [
		{
			field: 'no',
			headerName: '#',
			disableColumnMenu: true,
			sortable: false,
			filter: false,
			filterable: false,
			width: 80,
			align: 'center',
			headerAlign: 'center',
			renderCell: (value) => (
				<span>
					{(pagination.page - 1) * pagination.pageSize +
						(value.api.getRowIndex(value.id) + 1)}
				</span>
			),
		},
		...Columns,
		{
			field: 'actions',
			headerName: 'Action',
			width: 75,
			type: 'actions',
			disableColumnMenu: true,
			sortable: false,
			getActions: (params) =>
				UimActionButtons(params?.row, {
					detailAction: () => navigate(`${URL_PATHS.IDEA}/${params.id}`),
					updateAction: () => onOpenModal(params?.row, 'update'),
					deleteAction: () => requests.delete(params?.id),
				}),
		},
	];

	const requests = {
		create: (value) => {
			setStatus({ ...status, visibleModal: false });
			toast.promise(
				axioc.post(API_PATHS.ADMIN.MANAGE_IDEA, value).then(() => sleep(700)),
				{
					pending: toastMessages.WAIT,
					error: toastMessages.errs.added('Idea'),
					success: {
						render() {
							loadData();
							return toastMessages.succs.added('Idea');
						},
					},
				},
			);
		},
		update: (value) => {
			setStatus({ ...status, visibleModal: false });
			toast.promise(
				axioc
					.put(`${API_PATHS.ADMIN.MANAGE_IDEA}/${value?.id}`, {
						title: value.title,
						content: value.content,
						tags: value.tags,
						attachments: value.attachments,
						is_anonymous: value.is_anonymous,
						submission_id: value.submission_id,
					})
					.then(() => sleep(700)),
				{
					pending: toastMessages.WAIT,
					error: toastMessages.errs.edited('Idea'),
					success: {
						render() {
							loadData();
							return toastMessages.succs.edited('Idea');
						},
					},
				},
			);
		},
		delete: (id) => {
			setStatus({ ...status, visibleModal: false });
			toast.promise(
				axioc
					.delete(`${API_PATHS.ADMIN.MANAGE_IDEA}/${id}`)
					.then(() => sleep(700)),
				{
					pending: toastMessages.WAIT,
					error: toastMessages.errs.deleted('Idea'),
					success: {
						render() {
							loadData();
							return toastMessages.succs.deleted('Idea');
						},
					},
				},
			);
		},
	};

	return (
		<>
			<ContentHeader
				title='Idea Management'
				tooltipContent='Add idea'
				onOpenModal={() => onOpenModal(null, 'create')}
				onClickAction={() => setTableToolBar((pre) => !pre)}
				classes={{
					headingClassNames: 'managementidea_heading',
					titleClassNames: 'managementidea_title',
				}}
			/>

			<UimTable
				rows={data?.rows}
				columns={columns}
				totalItems={data?.total}
				showTableToolBar={tableToolBar}
				classes={{ tableClassNames: 'managementidea_table' }}
				pagination={{
					page: pagination.page,
					pageSize: pagination.pageSize,
					onPageChange: (_, page) => setPagination({ ...pagination, page }),
					onPageSizeChange: (event) =>
						setPagination({
							...pagination,
							pageSize: event?.target?.value,
							page: 1,
						}),
				}}
			/>

			{status.visibleModal && (
				<ModalIdea
					visible={status.visibleModal}
					action={status.action}
					onClose={onCloseModal}
					onCreate={requests.create}
					onUpdate={requests.update}
					exIdeaData={rowData}
				/>
			)}
		</>
	);
}
