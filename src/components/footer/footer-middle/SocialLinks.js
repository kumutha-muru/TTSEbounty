import { useTheme } from "@emotion/react";
import { IconButton, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import { Facebook, Instragram, LinkedIn, Pinterest, Twitter } from "./Icon";
import facebookIcon from "../../../../public/static/footer/socialicons/facebook.svg";
import instraIcon from "../../../../public/static/footer/socialicons/instragram.svg";
import twitterIcon from "../../../../public/static/footer/Twitter.svg";
import linkedInIcon from "../../../../public/static/footer/socialicons/linkedIn.svg";
import pinterestIcon from "../../../../public/static/footer/socialicons/pinterest.svg";
import CustomImageContainer from "../../CustomImageContainer";

const SocialLinks = (props) => {
	const { configData, landingPageData } = props;
	const { t } = useTranslation();
	const clickHandler = (link) => {
		window.open(link);
	};
	const theme = useTheme();
	const iconHandler = (name) => {
		switch (name) {
			case "facebook":
				return facebookIcon.src;
			case "instagram":
				return instraIcon.src;
			case "twitter":
				return twitterIcon.src;
			case "linkedin":
				return linkedInIcon.src;
			case "pinterest":
				return pinterestIcon.src;
			default:
				return twitterIcon.src;
		}
	};
	return (
		<CustomStackFullWidth spacing={2}>
			<Typography sx={{ fontSize: "16px", mb: 2 }} color="whiteContainer.main">
				{landingPageData?.fixed_footer_description}
			</Typography>
			<CustomStackFullWidth
				direction="row"
				spacing={3}
				alignItems="center"
				justifyContent={{ xs: "center", sm: "flex-start" }}
				flexWrap="wrap"
				pb={2}
			>
				{configData &&
					configData?.social_media?.length > 0 &&
					configData?.social_media?.map((item, index) => {
						const { name, link } = item;
						return (
							<IconButton
								sx={{
									padding: "0px",
									color: theme.palette.primary.icon,
									transition: "all ease 0.5s",
									"&:hover": {
										transform: "scale(1.14)",
										color: theme.palette.primary.main,
									},
								}}
								key={index}
								onClick={() => clickHandler(link)}
							>
								<CustomImageContainer
									src={iconHandler(name)}
									alt={name}
									height="20px"
									width="25px"
									objectfit="contained"
								/>
							</IconButton>
						);
					})}
			</CustomStackFullWidth>
		</CustomStackFullWidth>
	);
};

SocialLinks.propTypes = {};

export default SocialLinks;
