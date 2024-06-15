import {
	Box,
	List,
	ListItem,
	Paper,
	Stack
} from "@mui/material";
import { useState, useEffect, useRef } from "react";

const CorecInfo = () => {
	const [hours, setHours] = useState([]);

	const request = {
		placeId: 'ChIJN6cJ18zQuDsRs3jMViVhR6I',
		fields: ['name', 'opening_hours']
	};

	const isFirstRender = useRef(true);
	useEffect(() => {
		if (isFirstRender.current === true) {
			//eslint-disable-next-line
			const service = new google.maps.places.PlacesService(document.createElement('div'));
			service.getDetails(request, placesCallback);
			function placesCallback(place, status) {
				//eslint-disable-next-line
				if (status !== google.maps.places.PlacesServiceStatus.OK) return;
				if (place.opening_hours) {
					console.log(`${place.opening_hours.weekday_text}`);
					setHours(place.opening_hours.weekday_text);
				}
			}
			isFirstRender.current = false;
		}
	});

	function listTimes(time) {
		return (
			<ListItem
				component="div"
				disablePadding
				sx={{
					paddingLeft: '16px',
					paddingRight: '4px',
					borderBottom: '1px solid #e0e0e0',
					marginBottom: '8px',
					paddingBottom: '8px',
					paddingTop: '4px',
				}}
			>
				<span className="smallListItem">{`${time}`}</span>
			</ListItem>
		)
	}

	// return (
	// 	<Box sx={{
	// 		width: 650,
	// 		height: 350,
	// 		bgcolor: "background.paper",
	// 		boxShadow: 1,
	// 		borderRadius: 2,
	// 		p: 2,
	// 		position: 'relative', // Ensure Box is relatively positioned for absolute children
	// 	}}>
	// 		<Stack direction="column" spacing={2} sx={{ height: '100%' }}>
	// 			<Paper style={{
	// 				maxWidth: 250,
	// 				maxHeight: 300,
	// 			}}
	// 				elevation={3}>
	// 				<List>
	// 					<ListItem
	// 						component="div"
	// 						disablePadding
	// 						sx={{
	// 							paddingLeft: '16px',
	// 							paddingRight: '4px',
	// 							borderBottom: '1px solid #e0e0e0',
	// 							marginBottom: '8px',
	// 							paddingBottom: '8px',
	// 							paddingTop: '4px',
	// 						}}
	// 					>
	// 						<b>Corec Hours and Directions</b>
	// 					</ListItem>
	// 					{hours.map((time) => listTimes(time))}
	// 				</List>
	// 			</Paper>
	// 			{/* <Box sx={{ position: 'absolute', bottom: 16, right: 16, width: '250px', height: '200px' }}>
	// 				<iframe
	// 					title="map"
	// 					width="250"
	// 					height="200"
	// 					style={{ border: 0 }}
	// 					loading="lazy"
	// 					allowFullScreen
	// 					src="https://www.google.com/maps/embed/v1/directions?origin=place_id:ChIJN6cJ18zQuDsRs3jMViVhR6I&destination=place_id:ChIJN6cJ18zQuDsRs3jMViVhR6I&key=AIzaSyAX3ogg6uXEyBxm_OyGGhvv9Z6hUr6yKts"
	// 				>
	// 				</iframe>
	// 			</Box> */}
	// 		</Stack>
	// 	</Box>
	// );
}

export default CorecInfo;
