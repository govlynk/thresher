import styled from "@emotion/styled";
import React from "react";
import { Menu } from "lucide-react"; // Replace MenuOutlinedIcon
import logo from "../../assets/images/logo.png";

const StyledSidebarHeader = styled.div`
	height: 64px;
	min-height: 64px;
	display: flex;
	align-items: center;
	padding: 0 20px;
	cursor: pointer;

	> div {
		width: 100%;
		overflow: hidden;
	}
`;

const StyledLogo = styled.div`
	width: ${(props) => (props.isCollapsed ? "40px" : "35px")};
	min-width: ${(props) => (props.isCollapsed ? "40px" : "35px")};
	height: ${(props) => (props.isCollapsed ? "40px" : "35px")};
	min-height: ${(props) => (props.isCollapsed ? "40px" : "35px")};
	margin: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
	color: white;
	font-size: 24px;
	font-weight: 700;
`;

const SidebarHeader = ({ isCollapsed, setIsCollapsed }) => {
	return (
		<StyledSidebarHeader onClick={() => setIsCollapsed(!isCollapsed)} icon={<Menu />}>
			<div style={{ display: "flex", alignItems: "center", justifyContent: isCollapsed ? "center" : "flex-start" }}>
				<StyledLogo isCollapsed={isCollapsed}>
					<Menu />
				</StyledLogo>
				{!isCollapsed && <img src={logo} alt='Logo' style={{ width: "80%" }} />}
			</div>
		</StyledSidebarHeader>
	);
};

export default SidebarHeader;
