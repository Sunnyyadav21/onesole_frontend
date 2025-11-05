import { Link } from 'react-router-dom'

//images
import logo from '@/assets/images/logo.png'
// import logoDark from '@/assets/images/logo-dark.png'
import logoSm from '@/assets/images/logo-sm.png'
import { getMenuItems } from '@/common'
import AppMenu from './Menu'
import SimpleBar from 'simplebar-react'

/* Sidebar content */
const SideBarContent = () => {
	return (
		<>
			<AppMenu menuItems={getMenuItems()} />
			<div className="clearfix" />
		</>
	)
}
const LeftSidebar = () => {
	return (
		<>
			<div className="leftside-menu">
				{/* Brand Logo Light */}
				<Link to="/medicalapp" className="logo logo-light">
					<span className="logo-lg mt-2">
						<img src={logo} alt="logo" />

					</span>
					<span className="logo-sm">
						{/* <h3 style={{marginTop:'20px'}}>M</h3> */}
						<img src={logoSm} alt="small logo" />
					</span>
				</Link>
				{/* Brand Logo Dark */}
				<a href="index.html" className="logo logo-dark">
					<span className="logo-lg">
						<img src={logo} alt="dark logo" />
					</span>
					<span className="logo-sm">
						<img src={logo} alt="small logo" />
					</span>
				</a>
				{/* Sidebar -left */}
				<SimpleBar
					className="h-100"
					id="leftside-menu-container"
					data-simplebar=""
				>
					{/*- Sidemenu */}
					<SideBarContent />
					{/*- End Sidemenu */}
					<div className="clearfix" />
				</SimpleBar>
			</div>
		</>
	)
}

export default LeftSidebar
