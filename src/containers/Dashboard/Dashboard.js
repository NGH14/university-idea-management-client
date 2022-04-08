import * as React from 'react';
import Paper from '@mui/material/Paper';
import LineAxisIcon from '@mui/icons-material/LineAxis';
import IdeaPopularChart from '../../components/ChartDashboard/IdeaPopularChart';
import _ from 'lodash';
import TotalSubmissionChart from '../../components/ChartDashboard/TotalSubmissionChart';
import { DateRangePicker, LocalizationProvider } from '@mui/lab';
import DatePicker from '@mui/lab/DatePicker';
import { CircularProgress, Grid, Slider, TextField } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { useEffect, useState } from 'react';
import moment from 'moment';
import IdeaInfoChart from '../../components/ChartDashboard/IdeaInfoChart';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { dataIdeaInfo } from '../../components/ChartDashboard/FakeData';
import AddIcon from '@mui/icons-material/Add';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import { CardMedia } from '@material-ui/core';
import { Item } from 'devextreme-react/box';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { AuthRequest } from '../../common/AppUse';

export default function Dashboard() {
	const [data, setData] = useState({
		totalSUb: [],
		topIdea: [],
		infoData: [],
	});
	const [loading, setLoading] = useState(false);
	const [display, setDisplay] = useState({
		sub: [1, 6],
		ideaInfo: [1, 15],
	});
	let today = new Date();
	const [filter, setFilter] = useState({
		year: new Date(today.getFullYear(), 0, 1),
		monthYearIdea: new Date(today.getFullYear(), 0, 1),
		monthYearIdeaInfo: new Date(today.getFullYear(), 0, 1),
	});

	useEffect(() => {
		loadData();
	}, [filter]);
	const loadData = async () => {
		const year = moment(filter.year).format('YYYY');
		const monthIdea = moment(filter.monthYearIdea).format('MM');
		const monthInfo = moment(filter.monthYearIdeaInfo).format('MM');
		axios
			.all([
				AuthRequest.get(`dashboard/sum-submissions?year=${year}`),
				AuthRequest.get(
					`dashboard/top-ideas?month=${monthIdea}&year=${year}`,
				),
				AuthRequest.get(
					`dashboard/activities?month=${monthInfo}&year=${year}`,
				),
			])
			.then(
				axios.spread(function (resSub, resIdeas, resAct) {
					setData({
						...data,
						totalSUb: resSub?.data?.result,
						topIdea: resIdeas?.data?.result,
						infoData: resAct?.data?.result,
					});
				}),
			);
		//api load Data
	};




	const renderChartSubmissionTotal = () => {
		return (
			<TotalSubmissionChart
				filter={filter}
				setFilter={setFilter}
				data={data.totalSUb}
				loadData={loadData}
			/>

		);
	};

	const renderPopularIdea = () => {
		return (
			<IdeaPopularChart
				timeKey={filter.monthYearIdea}
				data={data?.topIdea}
			/>

		);
	};

	const renderIdeaInfo = () => {
		return (
			<IdeaInfoChart
				timeKey={filter.monthYearIdea}
				data={data.infoData}
				display={display.ideaInfo}
			/>

		);
	};
	const Item = styled(Paper)(({ theme }) => ({
		// backgroundColor: theme.palette.mode === '#ffc107' ? '#ffc107' : '#ffc107',
		...theme.typography.body2,
		padding: theme.spacing(2),
		textAlign: 'center',
		color: theme.palette.text.secondary,
	}));
	const renderTop = () => {
		return (
			<div style={{ width: '100%', marginBottom: 20 }}>
				<Typography style={{ fontSize: 28, fontWeight: 'bold' }}>
					Dashboard
				</Typography>
				<br></br>
				<div>
					<Box sx={{ flexGrow: 1 }}>
						<Grid
							container
							spacing={{ xs: 4, md: 8 }}
							columns={{ xs: 4, sm: 8, md: 16 }}>
							<Grid item xs={4} sm={4} md={4}>
								<Item
									style={{
										height: 100,
										backgroundColor: '#fff',
									}}>
									<h1
										style={{
											fontSize: 12,
										}}>
										{_.toUpper('Total submission')}
									</h1>
									<span
										style={{
											fontSize: 32,
										}}>
										500
									</span>
								</Item>
							</Grid>
							<Grid item xs={4} sm={4} md={4}>
								<Item
									style={{
										height: 100,
										backgroundColor: '#fff',
									}}>
									<h1
										style={{
											fontSize: 12,
										}}>
										{_.toUpper('Total idea')}
									</h1>
									<span
										style={{
											fontSize: 32,
										}}>
										500
									</span>
								</Item>
							</Grid>
							<Grid item xs={4} sm={4} md={4}>
								<Item
									style={{
										height: 100,
										backgroundColor: '#fff',
									}}>
									<h1
										style={{
											fontSize: 12,
										}}>
										{_.toUpper('Total like')}
									</h1>
									<span
										style={{
											fontSize: 32,
										}}>
										500
									</span>
								</Item>
							</Grid>
							<Grid item xs={4} sm={4} md={4}>
								<Item
									style={{
										height: 100,
										backgroundColor: '#fff',
									}}>
									<h1
										style={{
											fontSize: 12,
										}}>
										{_.toUpper('Total dislike')}
									</h1>
									<span
										style={{
											fontSize: 32,
										}}>
										500
									</span>
								</Item>
							</Grid>
						</Grid>
					</Box>
				</div>
			</div>
		);
	};

	return (
		<div>
			{renderTop()}
			{renderChartSubmissionTotal()}
			<div style={{ display: 'flex', width: '100%', marginTop: 20 }}>
				{renderPopularIdea()}
				{renderIdeaInfo()}
			</div>
		</div>
	);
}