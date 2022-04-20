/* eslint-disable react-hooks/exhaustive-deps */
import './style.css';

import './style.css';

import { Checkbox, FormControlLabel, FormGroup, ListItem } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import { API_PATHS, axioc, getGuid, toReadableFileSize } from 'common';
import { UimAutoComplete, UimModalForm, UimTextField } from 'components/Uim';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import { AiOutlineFile } from 'react-icons/ai';
import { MdOutlineDriveFolderUpload } from 'react-icons/md';
import { RiDeleteBack2Fill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { styled } from '@mui/material/styles';

// const ListItem = styled('li')(({ theme }) => ({ margin: theme.spacing(0.5) }));

const toastMessages = {
	ERR_MAX_FILES_NUMBER: 'Maximum files is 4 !!',
	ERR_FILE_ADD_FAILED: 'Failed to add file !!',
	ERR_FILE_REJECTED: 'File is invalid !!',
	ERR_FILE_BIG: 'cannot be added !!',
	ERR_SERVER_ERROR: 'Something went wrong, please try again !!',
};

const validationSchema = yup.object({
	title: yup.string().required('Idea title is required'),
	content: yup.string().required('Please Provide content'),
	tags: yup.array().max(3, 'Only 3 tags per idea').nullable(),
	attachments: yup.array().nullable(),
	is_anonymous: yup.bool(),
	submission_id: yup
		.string()
		.required('Please specify the submission for this idea'),
});

function UpdateIdeaForm(props) {
	const { onClose, onUpdate, specifySub, initialValue } = props;
	const [attachments, setAttachments] = useState([]);
	const [subOptions, setSubOptions] = useState([]);
	const [tagOptions, setTagOptions] = useState([]);

	const formik = useFormik({
		initialValues: {
			...initialValue,
			submission_id: initialValue?.submission?.id,
		},
		validationSchema: validationSchema,
		onSubmit: (values) => {
			onUpdate({
				...values,
				attachments: attachments.map((_) => {
					delete _.guid;
					delete _.size;
					return _;
				}),
			});
		},
	});

	useEffect(() => {
		(async () => {
			!specifySub
				? await axioc
						.get(API_PATHS.ADMIN.MANAGE_SUB + '/list')
						.catch(() =>
							toast.error(toastMessages.ERR_SERVER_ERROR),
						)
						.then((res) => setSubOptions(res?.data?.result))
				: formik.setFieldValue(
						'submission_id',
						initialValue?.submission?.id,
				  );

			await axioc
				.get(API_PATHS.ADMIN.MANAGE_TAG + '/list')
				.catch(() => toast.error(toastMessages.ERR_SERVER_ERROR))
				.then((res) => setTagOptions(res?.data?.result));
		})();
	}, []);

	const FILE_SIZE = 1e7;

	const handleDrop = (acceptedFiles) => {
		try {
			if (attachments?.length === 4) {
				toast.error(toastMessages.ERR_MAX_FILES_NUMBER);
				return;
			}

			for (const file of acceptedFiles) {
				if (
					attachments.reduce((a, b) => a + (b['size'] || 0), 0) +
						file.size >
					FILE_SIZE
				) {
					toast.error(`${file.name} ${toastMessages.ERR_FILE_BIG}`);
					return;
				}

				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = () => {
					setAttachments((oldArr) => [
						...oldArr,
						{
							guid: `${getGuid()}_${file.name}`,
							size: file.size,
							data: reader.result.split(',')[1],
							name: file.name,
							description: file.name,
							mime: file.type,
						},
					]);
				};
			}
		} catch (err) {
			toast.error(toastMessages.ERR_FILE_ADD_FAILED);
		}
	};

	const handleDeleteAttachment = (attachmentToDelete) => () => {
		setAttachments((attachments) =>
			attachments.filter(
				(attachment) => attachment.guid !== attachmentToDelete.guid,
			),
		);
	};

	return (
		<UimModalForm
			entity='idea'
			action='edit'
			onClose={() => onClose()}
			ClassName='createideaform'
			onSubmit={formik.handleSubmit}
			showActionButton={true}>
			<div className='createideaform_group'>
				<div className='createideaform_content'>
					{specifySub ? (
						<UimTextField
							label='Submission'
							propName='submission_id'
							dynamic={{ value: initialValue?.submission?.title }}
							inputProps={{ disabled: true, readOnly: true }}
						/>
					) : (
						<UimAutoComplete.Select
							label='Submission'
							required={true}
							propName='submission_id'
							onBlur={formik.handleBlur}
							options={subOptions}
							defaultValue={initialValue?.submission}
							getOptionLabel={(option) => option?.title}
							onChange={(_, value) => {
								formik.setFieldValue(
									'submission_id',
									value.id ?? '',
								);
							}}
							dynamic={{
								value: formik.values.submission_id,
								error: formik.errors.submission_id,
								touched: formik.touched.submission_id,
							}}
						/>
					)}
				</div>

				<div className='createideaform_content'>
					<UimTextField
						label='Idea Title'
						required={true}
						propName='title'
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						dynamic={{
							value: formik.values.title,
							error: formik.errors.title,
							touched: formik.touched.title,
						}}
					/>
				</div>
			</div>
			<div className='createideaform_group'>
				<div className='createideaform_content'>
					<UimTextField
						label='Content'
						required={true}
						autoSize={true}
						minRows={5}
						propName='content'
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						dynamic={{
							value: formik.values.content,
							error: formik.errors.content,
							touched: formik.touched.content,
						}}
					/>
				</div>
			</div>

			<div className='createideaform_group'>
				<div className='createideaform_content'>
					<Dropzone
						onDrop={handleDrop}
						onDropRejected={() =>
							toast.error(toastMessages.ERR_FILE_REJECTED)
						}>
						{({ getRootProps, getInputProps }) => (
							<div
								{...getRootProps({
									className: 'dropzone',
								})}>
								<input {...getInputProps()} />
								<MdOutlineDriveFolderUpload className='dropzone_icon' />
								<p>
									Drag &#38; drop files, or click to select
									files
								</p>
								<span
									style={{
										padding: '5px',
										color: '#888',
										fontSize: '0.75em',
									}}>
									*This will overwrite the current
									attachments*
								</span>
							</div>
						)}
					</Dropzone>
					<span style={{ padding: '5px', color: '#888' }}>
						{attachments?.length !== 0 && (
							<span> Attach files size: </span>
						)}
						{attachments?.length !== 0 &&
							toReadableFileSize(
								attachments?.reduce(
									(n, { size }) => n + size,
									0,
								),
							)}
						{attachments?.length !== 0 && (
							<span> &nbsp;/&nbsp;10 MB</span>
						)}
					</span>
					{attachments?.length === 0 ? null : (
						<div className='createideaform_group'>
							<div className='createideaform_content'>
								<List
									sx={{
										display: 'flex',
										justifyContent: 'center',
										flexWrap: 'wrap',
										listStyle: 'none',
										p: 0.5,
										m: 0,
									}}>
									{attachments?.map((file, index) => (
										<ListItem
											key={index}
											secondaryAction={
												<IconButton
													edge='end'
													aria-label='delete'
													onClick={handleDeleteAttachment(
														file,
													)}>
													<RiDeleteBack2Fill id='attach_delete-icon' />
												</IconButton>
											}>
											<ListItemAvatar>
												<Avatar>
													<AiOutlineFile />
												</Avatar>
											</ListItemAvatar>
											<ListItemText
												sx={{
													display: 'flex',
													flexDirection: 'column',
													justifyContent: 'center',
												}}>
												<p
													style={{
														fontFamily: 'Poppins',
														fontSize: '1em',
													}}>
													{file.name}
												</p>
												<p
													style={{
														fontSize: '0.8em',
														color: '#333',
													}}>
													{toReadableFileSize(
														file.size,
													)}
												</p>
											</ListItemText>
										</ListItem>
									))}
								</List>
							</div>
						</div>
					)}
				</div>
			</div>
		</UimModalForm>
	);
}

export default React.memo(UpdateIdeaForm);
