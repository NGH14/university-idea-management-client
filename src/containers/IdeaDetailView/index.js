/* eslint-disable react-hooks/exhaustive-deps */
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Add } from '@mui/icons-material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import TagIcon from '@mui/icons-material/Tag';
import {
	Avatar,
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	CircularProgress,
	Collapse,
	IconButton,
	styled,
	Typography,
} from '@mui/material';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Tippy from '@tippyjs/react';
import { axioc, sleep, toastMessages } from 'common';
import { stringToSvg } from 'common/DiceBear';
import { API_PATHS, URL_PATHS } from 'common/env';
import FloatButton from 'components/Custom/FloatButton';
import CommentIdea from 'components/Idea/CommentIdea';
import ModalIdea from 'components/Idea/ModalIdea';
import _ from 'lodash';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { BiCommentDetail } from 'react-icons/bi';
import { IoMdArrowRoundDown, IoMdArrowRoundUp } from 'react-icons/io';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ExpandMore = styled((props) => {
	const { expand, ...other } = props;
	return <Button {...other} />;
})(({ theme }) => ({
	marginLeft: 'auto',
	transition: theme.transitions.create('transform', {
		duration: theme.transitions.duration.shortest,
	}),
}));

export default function IdeaDetailView() {
	const navigate = useNavigate();
	const [data, setData] = useState();
	const [comments, setComments] = useState([]);
	const [anchorEl, setAnchorEl] = useState(null);
	const { id } = useParams();

	const [status, setStatus] = useState({
		visibleModal: false,
		action: 'update',
		loading: false,
	});

	useEffect(() => {
		loadData();
	}, []);

	const view = async () => {
		if (data)
			return await axioc
				.post(`${API_PATHS.SHARED.VIEW}/${data?.id}`)
				.catch(() => {});
	};

	const loadData = async () => {
		setStatus({ ...data, loading: true });
		await axioc
			.get(`${API_PATHS.SHARED.IDEA}/${id}`)
			.then((res) => {
				setStatus({ ...data, loading: false });
				setData(res?.data?.result ?? {});
			})
			.catch(() => {
				setStatus({ ...data, loading: false });
				toast.error(toastMessages.errs.UNEXPECTED);
			});
	};

	const handleOnLikeness = async (isLike) => {
		if (data?.requester_is_like == null)
			await axioc
				.post(`${API_PATHS.SHARED.LIKE}/${data?.id}`, {
					is_like: isLike,
				})
				.then((res) => {
					const newData = data;
					newData.requester_is_like = isLike;
					newData.likes = res?.data?.result?.likes;
					newData.dislikes = res?.data?.result?.dislikes;
					setData(newData);
				})
				.catch(() => {});

		if (data?.requester_is_like !== isLike)
			await axioc
				.put(`${API_PATHS.SHARED.LIKE}/${data?.id}`, {
					is_like: isLike,
				})
				.then(async (res) => {
					const newData = data;
					newData.requester_is_like = isLike;
					newData.likes = res?.data?.result?.likes;
					newData.dislikes = res?.data?.result?.dislikes;
					setData(newData);
				})
				.catch(() => {});
	};

	const requests = {
		update: (value) =>
			toast.promise(
				axioc
					.put(`${API_PATHS.SHARED.IDEA}/${value?.id}`, value)
					.then(() => sleep(700))
					.then((res) => {
						setStatus({ ...status, visibleModal: false });
						const indexData = data?.findIndex((x) => x?.id === value?.id);
						data[indexData] = res?.data?.result;
						setData((oldData) => [...oldData, data]);

						toast.info(
							<RouterLink to={`${URL_PATHS.IDEA}/${res?.data?.result?.id}`}>
								Idea details:{' '}
								{() => {
									const title = res?.data?.result?.title;
									return title?.length > 50
										? title?.substr(0, 49) + '...'
										: title;
								}}
							</RouterLink>,
						);
					}),
				{
					pending: toastMessages.WAIT,
					error: toastMessages.errs.UNEXPECTED,
				},
			),
		delete: (id) =>
			toast.promise(
				axioc.delete(`${API_PATHS.SHARED.IDEA}/${id}`).then(() => sleep(700)),
				{
					pending: toastMessages.WAIT,
					error: toastMessages.errs.UNEXPECTED,
					success: {
						render() {
							const indexData = data?.findIndex((_) => _?.id === id);
							data?.splice(indexData, 1);
							setData((oldData) => [...oldData, data]);
							loadData();
							return toastMessages.succs.deleted('idea');
						},
					},
				},
			),
	};

	const renderModal = () => (
		<ModalIdea
			visible={status.visibleModal}
			action={status.action}
			onClose={() => setStatus({ ...status, visibleModal: false })}
			onUpdate={requests.update}
			onCreate={requests.create}
		/>
	);

	const renderCardHeader = () => (
		<CardHeader
			className='idea_header'
			title={data?.user?.full_name}
			avatar={
				<Avatar aria-label='avatar'>
					{data?.is_anonymous || data?.user?.avatar
						? stringToSvg(data?.user?.avatar)
						: 'R'}
				</Avatar>
			}
			subheader={
				data?.created_date ? (
					<>
						{moment(data?.created_date).fromNow()}&nbsp;
						<Tippy content={'Detail submission'}>
							<label
								style={{
									textDecoration: 'none',
									color: 'initial',
									cursor: 'pointer',
								}}
							>
								<RouterLink
									to={`/idea/${data?.id}`}
									style={{
										textDecoration: 'none',
										cursor: 'pointer',
										color: 'initial',
									}}
								>
									<span
										style={{
											textDecoration: 'none',
											color: 'initial',
											fontSize: '12px',
										}}
									>
										in&nbsp;{data?.submission?.title}
										&nbsp;submission
									</span>
								</RouterLink>
							</label>
						</Tippy>
					</>
				) : (
					'September 14, 2016'
				)
			}
		></CardHeader>
	);

	const renderIdeaTags = () => (
		<Stack
			direction='row'
			spacing={1}
			sx={{
				margin: '0px 15px',
				opacity: '0.8',
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: 'flex-start',
				gap: 1,
			}}
		>
			{data?.tags?.map((tag, index) => (
				<Chip
					sx={{
						fontSize: '0.8em',
						color: '#333',
					}}
					key={data?.title + tag.name + index}
					icon={<TagIcon />}
					label={tag}
					size='small'
					variant='outlined'
				/>
			))}
		</Stack>
	);

	const renderCardContent = () => {
		return (
			<CardContent sx={{ fontFamily: 'Poppins, sans-serif' }}>
				<Tippy content={'Detail idea'}>
					<RouterLink
						to={`${URL_PATHS.IDEA}/${data?.id}`}
						style={{
							textDecoration: 'none',
							color: 'rgba(0, 1, 17, 0.8)',
							fontSize: '1.2rem',
							lineHeight: '44px',
							fontWeight: '600',
							cursor: 'pointer',
						}}
					>
						{data?.title}
					</RouterLink>
				</Tippy>

				<div className='maxWidth300'>
					<div className='multiLineEllipsis'>
						<Typography
							variant='body2'
							color='text.secondary '
							className='multiLineEllipsis'
						>
							{data?.content}
						</Typography>
					</div>
				</div>
			</CardContent>
		);
	};

	const renderActionButton = () => {
		return (
			<CardActions
				style={{
					margin: '5px 5px 2px',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					width: '100%',
					fontSize: 12,
				}}
			>
				<Button
					className='idea_action'
					fullWidth
					aria-label='up vote'
					onClick={() =>
						handleOnLikeness(data?.requester_is_like === true ? null : true)
					}
					startIcon={
						<IoMdArrowRoundUp
							style={{
								color: data?.requester_is_like === true ? '#626ef0' : '',
							}}
						/>
					}
					color='inherit'
					size='large'
				>
					{`${data?.likes}`}
				</Button>
				<Button
					className='idea_action'
					fullWidth
					aria-label='down vote'
					onClick={() =>
						handleOnLikeness(data?.requester_is_like === false ? null : false)
					}
					style={{ marginRight: 20, marginLeft: 20 }}
					startIcon={
						<IoMdArrowRoundDown
							style={{
								color: data?.requester_is_like === false ? '#626ef0' : '',
							}}
						/>
					}
					color={'inherit'}
					size={'large'}
				>
					{`${data?.dislikes}`}
				</Button>
				<ExpandMore
					disabled
					className='idea_action'
					fullWidth
					style={{ marginRight: 20, marginLeft: 20 }}
					color={'inherit'}
					size={'large'}
					startIcon={<BiCommentDetail />}
					aria-label='show more'
				>
					{data?.comments_count}
				</ExpandMore>
			</CardActions>
		);
	};

	const renderListFile = () =>
		data?.file && !data?.file?.length === 0 ? (
			<Card style={{ marginLeft: 15, marginRight: 15 }}>
				<IconButton>
					<AttachFileIcon />
				</IconButton>
				<a href={`${data?.file?.name}`}>{data?.file?.name}</a>
			</Card>
		) : (
			<></>
		);

	const ContentIdea = () =>
		!status.loading ? (
			<Card
				style={{
					borderRadius: '5px',
					boxShadow: '1px 2px 4px rgba(0,0,0,0.3)',
					padding: '5px',
					marginTop: 30,
					maxWidth: '70rem',
					marginInline: 'auto',
				}}
			>
				{renderCardHeader()}
				{renderCardContent()}
				{renderIdeaTags()}
				{renderListFile()}
				{renderActionButton()}

				{console.log(data)}
				<Collapse in={comments} timeout='auto' unmountOnExit>
					<CommentIdea data={data} ideaId={data?.id} />
				</Collapse>
			</Card>
		) : (
			<Box sx={{ display: 'flex' }}>
				<CircularProgress />
			</Box>
		);

	if (status.loading || !data)
		return (
			<Box sx={{ display: 'flex' }}>
				<CircularProgress />
			</Box>
		);

	return (
		<div className='homepage_wrapper'>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<Button
					variant='text'
					style={{ marginRight: 15 }}
					startIcon={<ArrowBackIcon />}
					onClick={() => navigate(-1)}
				>
					Back
				</Button>
			</div>

			<ContentIdea />
			<FloatButton
				onClick={() =>
					setStatus({
						...status,
						visibleModal: true,
						action: 'create',
					})
				}
				tippy={{ placement: 'left' }}
				size='medium'
				color='primary'
				ariaLabel='submit new idea'
				icon={<Add />}
			/>

			{status.visibleModal && renderModal()}
		</div>
	);
}
