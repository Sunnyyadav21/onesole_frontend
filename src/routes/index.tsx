// @ts-nocheck
import React from 'react'
import { Route, RouteProps } from 'react-router-dom'
import axios from 'axios';
// components
import PrivateRoute from './PrivateRoute'

// lazy load all the views

// auth
const Login = React.lazy(() => import('../pages/auth/Login'))
const AdminLogin = React.lazy(() => import('../pages/admin/auth/Login'))
const Register = React.lazy(() => import('../pages/auth/Register'))
const Logout = React.lazy(() => import('../pages/auth/Logout'))
const ForgotPassword = React.lazy(() => import('../pages/auth/ForgotPassword'))
const LockScreen = React.lazy(() => import('../pages/auth/LockScreen'))

// // dashboard
const Dashboard = React.lazy(() => import('../pages/Dashboard'))
const Patient = React.lazy(() => import('../pages/Patient'))
const AllPatient = React.lazy(() => import('../pages/allpatient'))
const Medicine = React.lazy(() => import('../pages/addMedicine'))
const AllMedicine = React.lazy(() => import('../pages/allmedicine'))
const AllVitalChart = React.lazy(() => import('../pages/allvitalchart'))
const CreateVital = React.lazy(() => import('../pages/createVital'))
const VitalChart = React.lazy(() => import('../pages/vitalChart'))
const AllVital = React.lazy(() => import('../pages/allvital'))
const Dietchart = React.lazy(() => import('../pages/Dietchart'))
const Alldietchart = React.lazy(() => import('../pages/alldietchart'))
const Alldiet = React.lazy(() => import('../pages/alldiet'))
const Creatediet = React.lazy(() => import('../pages/createdite'))
const TestReport = React.lazy(() => import('../pages/TestReport'))
const AllReport = React.lazy(() => import('../pages/allreport'))
const AddHospital = React.lazy(() => import('../pages/hospital'))
const AllHospital = React.lazy(() => import('../pages/allhospital'))
const AddDoctor = React.lazy(() => import('../pages/doctor'))
const AllDoctor = React.lazy(() => import('../pages/alldoctor'))
const AddNurse = React.lazy(() => import('../pages/nurse'))
const AllNurse = React.lazy(() => import('../pages/allnurse'))
const RoleManagement = React.lazy(() => import('../pages/rolemanagement'))
const Editprofile = React.lazy(() => import('../pages/editprofile'))
const Changepassword = React.lazy(() => import('../pages/changepassword'))
const Adduser = React.lazy(() => import('../pages/adduser'))
const Usermanagement = React.lazy(() => import('../pages/usermanagement'))



// // pages
const ProfilePages = React.lazy(() => import('../pages/other/Profile/'))
const InvoicePages = React.lazy(() => import('../pages/other/Invoice'))
const FAQPages = React.lazy(() => import('../pages/other/FAQ'))
const PricingPages = React.lazy(() => import('../pages/other/Pricing'))
const MaintenancePages = React.lazy(() => import('../pages/other/Maintenance'))
const StarterPages = React.lazy(() => import('../pages/other/Starter'))
const ContactListPages = React.lazy(() => import('../pages/other/ContactList'))
const TimelinePages = React.lazy(() => import('../pages/other/Timeline'))

// // base ui
const Accordions = React.lazy(() => import('../pages/ui/Accordions'))
const Alerts = React.lazy(() => import('../pages/ui/Alerts'))
const Avatars = React.lazy(() => import('../pages/ui/Avatars'))
const Badges = React.lazy(() => import('../pages/ui/Badges'))
const Breadcrumb = React.lazy(() => import('../pages/ui/Breadcrumb'))
const Buttons = React.lazy(() => import('../pages/ui/Buttons'))
const Cards = React.lazy(() => import('../pages/ui/Cards'))
const Carousel = React.lazy(() => import('../pages/ui/Carousel'))
const Collapse = React.lazy(() => import('../pages/ui/Collapse'))
const Dropdowns = React.lazy(() => import('../pages/ui/Dropdowns'))
const EmbedVideo = React.lazy(() => import('../pages/ui/EmbedVideo'))
const Grid = React.lazy(() => import('../pages/ui/Grid'))
const Links = React.lazy(() => import('../pages/ui/Links'))
const ListGroup = React.lazy(() => import('../pages/ui/ListGroup'))
const Modals = React.lazy(() => import('../pages/ui/Modals'))
const Notifications = React.lazy(() => import('../pages/ui/Notifications'))
const Offcanvas = React.lazy(() => import('../pages/ui/Offcanvas'))
const Placeholders = React.lazy(() => import('../pages/ui/Placeholders'))
const Pagination = React.lazy(() => import('../pages/ui/Pagination'))
const Popovers = React.lazy(() => import('../pages/ui/Popovers'))
const Progress = React.lazy(() => import('../pages/ui/Progress'))
const Spinners = React.lazy(() => import('../pages/ui/Spinners'))
const Tabs = React.lazy(() => import('../pages/ui/Tabs'))
const Tooltips = React.lazy(() => import('../pages/ui/Tooltips'))
const Typography = React.lazy(() => import('../pages/ui/Typography'))
const Utilities = React.lazy(() => import('../pages/ui/Utilities'))

// // extended ui
const Portlets = React.lazy(() => import('../pages/extended/Portlets'))
const RangeSlider = React.lazy(() => import('../pages/extended/RangeSlider'))
const Scrollbar = React.lazy(() => import('../pages/extended/ScrollBar'))

// // icons
const RemixIcons = React.lazy(() => import('../pages/ui/icons/RemixIcons'))
const BootstrapIcons = React.lazy(
	() => import('../pages/ui/icons/BootstrapIcons')
)
const MaterialIcons = React.lazy(
	() => import('../pages/ui/icons/MaterialIcons')
)

// charts
const ApexCharts = React.lazy(() => import('../pages/charts/ApexCharts'))
const SparklineCharts = React.lazy(
	() => import('../pages/charts/SparklinesCharts')
)
const ChartJs = React.lazy(() => import('../pages/charts/ChartJsCharts'))

// // forms
const BasicElements = React.lazy(
	() => import('../pages/ui/forms/BasicElements')
)
const FormAdvanced = React.lazy(() => import('../pages/ui/forms/FormAdvanced'))
const Validation = React.lazy(() => import('../pages/ui/forms/Validation'))
const Wizard = React.lazy(() => import('../pages/ui/forms/Wizard'))
const FileUploads = React.lazy(() => import('../pages/ui/forms/FileUploads'))
const Editors = React.lazy(() => import('../pages/ui/forms/Editors'))
const ImageCrop = React.lazy(() => import('../pages/ui/forms/ImageCrop'))
const Editable = React.lazy(() => import('../pages/ui/forms/Editable'))

// // tables
const BasicTables = React.lazy(() => import('../pages/ui/tables/BasicTables'))
const DataTables = React.lazy(() => import('../pages/ui/tables/DataTables'))

// // maps
const GoogleMaps = React.lazy(() => import('../pages/ui/maps/GoogleMaps'))
const VectorMaps = React.lazy(() => import('../pages/ui/maps/VectorMaps'))

// // error
const Error404 = React.lazy(() => import('../pages/error/Error404'))
const Error404Alt = React.lazy(() => import('../pages/error/Error404Alt'))
const Error500 = React.lazy(() => import('../pages/error/Error500'))

export interface RoutesProps {
	path: RouteProps['path']
	name?: string
	element?: RouteProps['element']
	route?: any
	exact?: boolean
	icon?: string
	header?: string
	roles?: string[]
	children?: RoutesProps[]
}

// dashboards
const dashboardRoutes: RoutesProps = {
	path: '/admin',
	name: 'Dashboards',
	icon: 'home',
	header: 'Navigation',
	children: [
		{
			path: '/',
			name: 'Root',
			element: <Dashboard />,
			route: PrivateRoute,
		},
		{
			path: '/dashboard',
			name: 'Dashboard',
			element: <Dashboard />,
			route: PrivateRoute,
		},
	],
}

const HospitalRoutes: RoutesProps = {
	path: '/hospital',
	name: 'hospital',
	icon: 'pages',
	header: 'Custom',
	element: <AddHospital />,
	route: PrivateRoute,
	children: [
		{
			path: '/AllHospital',
			name: 'Root',
			element: <AllHospital />,
			route: PrivateRoute,
		},

	],

}


const RoleManagements: RoutesProps = {
	path: '/rolemanagement',
	name: 'rolemanagement',
	icon: 'pages',
	header: 'Custom',
	element: <RoleManagement />,
	route: PrivateRoute,
	children: [
		{
			path: '/adduser',
			name: 'Root',
			element: <Adduser />,
			route: PrivateRoute,
		},
		{

			path: '/usermanagement',
			name: 'Root',
			element: <Usermanagement />,
			route: PrivateRoute,
		},
		{
			path: '/roleranagement',
			name: 'Root',
			element: <RoleManagement />,
			route: PrivateRoute,
		},

	],

}

const DoctorRoutes: RoutesProps = {
	path: '/doctor',
	name: 'doctor',
	icon: 'pages',
	header: 'Custom',
	element: <AddDoctor />,
	route: PrivateRoute,
	children: [
		{
			path: '/allDoctor',
			name: 'Root',
			element: <AllDoctor />,
			route: PrivateRoute,
		},

	],

}

const NurseRoutes: RoutesProps = {
	path: '/nurse',
	name: 'nurse',
	icon: 'pages',
	header: 'Custom',
	element: <AddNurse />,
	route: PrivateRoute,
	children: [
		{
			path: '/allnurse',
			name: 'Root',
			element: <AllNurse />,
			route: PrivateRoute,
		},

	],

}
const PatientRoutes: RoutesProps = {
	path: '/patient',
	name: 'patient',
	icon: 'pages',
	header: 'Custom',
	element: <Patient />,
	route: PrivateRoute,
	children: [
		{
			path: '/allpatient',
			name: 'Root',
			element: <AllPatient />,
			route: PrivateRoute,
		},

	],
}

const MedicineRoutes: RoutesProps = {
	path: '/medicine',
	name: 'medicine',
	icon: 'pages',
	header: 'Custom',
	element: <Medicine />,
	route: PrivateRoute,
	children: [
		{
			path: '/allmedicine',
			name: 'Root',
			element: <AllMedicine />,
			route: PrivateRoute,
		},

	],
}


const VitalChartRoutes: RoutesProps = {
	path: '/vitalchart',
	name: 'vitalchart',
	icon: 'pages',
	header: 'Custom',
	element: <VitalChart />,
	route: PrivateRoute,
	children: [
		{
			path: '/allvitalchart',
			name: 'Root',
			element: <AllVitalChart />,
			route: PrivateRoute,
		},
		{
			path: '/allvital',
			name: 'Root',
			element: <AllVital />,
			route: PrivateRoute,
		},
		{
			path: '/createVital',
			name: 'Root',
			element: <CreateVital />,
			route: PrivateRoute,
		},

	],

}


const DietchartRoutes: RoutesProps = {
	path: '/dietchart',
	name: 'dietchart',
	icon: 'pages',
	header: 'Custom',
	element: <Dietchart />,
	route: PrivateRoute,
	children: [
		{
			path: '/alldietchart',
			name: 'Root',
			element: <Alldietchart />,
			route: PrivateRoute,
		},
		{
			path: '/alldiet',
			name: 'Root',
			element: <Alldiet />,
			route: PrivateRoute,
		},
		{
			path: '/creatediet',
			name: 'Root',
			element: <Creatediet />,
			route: PrivateRoute,
		},

	],

}

const TestReportRoutes: RoutesProps = {
	path: '/testreport',
	name: 'testreport',
	icon: 'pages',
	header: 'Custom',
	element: <TestReport />,
	route: PrivateRoute,
	children: [
		{
			path: '/allreport',
			name: 'Root',
			element: <AllReport />,
			route: PrivateRoute,
		},
	]

}

const EditProfile: RoutesProps = {
	path: '/editprofile',
	name: 'editprofile',
	icon: 'pages',
	header: 'Custom',
	element: <Editprofile />,
	route: PrivateRoute,
	children: [
		{
			path: '/editprofile',
			name: 'Root',
			element: <Editprofile />,
			route: PrivateRoute,
		},
		{
			path: '/changepassword',
			name: 'Root',
			element: <Changepassword />,
			route: PrivateRoute,
		},
	]

}
// pages
const customPagesRoutes = {
	path: '/pages',
	name: 'Pages',
	icon: 'pages',
	header: 'Custom',
	children: [
		{
			path: '/pages/profile',
			name: 'Profile',
			element: <ProfilePages />,
			route: PrivateRoute,
		},
		{
			path: '/pages/invoice',
			name: 'Invoice',
			element: <InvoicePages />,
			route: PrivateRoute,
		},
		{
			path: '/pages/faq',
			name: 'FAQ',
			element: <FAQPages />,
			route: PrivateRoute,
		},
		{
			path: '/pages/pricing',
			name: 'Pricing',
			element: <PricingPages />,
			route: PrivateRoute,
		},
		{
			path: '/pages/starter',
			name: 'Starter Page',
			element: <StarterPages />,
			route: PrivateRoute,
		},
		{
			path: '/pages/contact-list',
			name: 'Contact List',
			element: <ContactListPages />,
			route: PrivateRoute,
		},
		{
			path: '/pages/timeline',
			name: 'Timeline',
			element: <TimelinePages />,
			route: PrivateRoute,
		},
		{
			path: 'pages/error-404-alt',
			name: 'Error - 404-alt',
			element: <Error404Alt />,
			route: PrivateRoute,
		},
	],
}

// ui
const uiRoutes: RoutesProps = {
	path: '/ui',
	name: 'Components',
	icon: 'pocket',
	header: 'UI Elements',
	children: [
		{
			path: '/ui/base',
			name: 'Base UI',
			children: [
				{
					path: '/ui/accordions',
					name: 'Accordions',
					element: <Accordions />,
					route: PrivateRoute,
				},
				{
					path: '/ui/alerts',
					name: 'Alerts',
					element: <Alerts />,
					route: PrivateRoute,
				},
				{
					path: '/ui/avatars',
					name: 'Avatars',
					element: <Avatars />,
					route: PrivateRoute,
				},
				{
					path: '/ui/badges',
					name: 'Badges',
					element: <Badges />,
					route: PrivateRoute,
				},
				{
					path: '/ui/breadcrumb',
					name: 'Breadcrumb',
					element: <Breadcrumb />,
					route: PrivateRoute,
				},
				{
					path: '/ui/buttons',
					name: 'Buttons',
					element: <Buttons />,
					route: PrivateRoute,
				},
				{
					path: '/ui/cards',
					name: 'Cards',
					element: <Cards />,
					route: PrivateRoute,
				},
				{
					path: '/ui/carousel',
					name: 'Carousel',
					element: <Carousel />,
					route: PrivateRoute,
				},
				{
					path: '/ui/collapse',
					name: 'Collapse',
					element: <Collapse />,
					route: PrivateRoute,
				},
				{
					path: '/ui/dropdowns',
					name: 'Dropdowns',
					element: <Dropdowns />,
					route: PrivateRoute,
				},
				{
					path: '/ui/embed-video',
					name: 'Embed Video',
					element: <EmbedVideo />,
					route: PrivateRoute,
				},
				{
					path: '/ui/grid',
					name: 'Grid',
					element: <Grid />,
					route: PrivateRoute,
				},
				{
					path: '/ui/links',
					name: 'Links',
					element: <Links />,
					route: PrivateRoute,
				},
				{
					path: '/ui/list-group',
					name: 'List Group',
					element: <ListGroup />,
					route: PrivateRoute,
				},
				{
					path: '/ui/modals',
					name: 'Modals',
					element: <Modals />,
					route: PrivateRoute,
				},
				{
					path: '/ui/notifications',
					name: 'Notifications',
					element: <Notifications />,
					route: PrivateRoute,
				},
				{
					path: '/ui/offcanvas',
					name: 'Offcanvas',
					element: <Offcanvas />,
					route: PrivateRoute,
				},
				{
					path: '/ui/placeholders',
					name: 'Placeholders',
					element: <Placeholders />,
					route: PrivateRoute,
				},
				{
					path: '/ui/pagination',
					name: 'Pagination',
					element: <Pagination />,
					route: PrivateRoute,
				},
				{
					path: '/ui/popovers',
					name: 'Popovers',
					element: <Popovers />,
					route: PrivateRoute,
				},
				{
					path: '/ui/progress',
					name: 'Progress',
					element: <Progress />,
					route: PrivateRoute,
				},
				{
					path: '/ui/spinners',
					name: 'Spinners',
					element: <Spinners />,
					route: PrivateRoute,
				},
				{
					path: '/ui/tabs',
					name: 'Tabs',
					element: <Tabs />,
					route: PrivateRoute,
				},
				{
					path: '/ui/tooltips',
					name: 'Tooltips',
					element: <Tooltips />,
					route: PrivateRoute,
				},
				{
					path: '/ui/typography',
					name: 'Typography',
					element: <Typography />,
					route: PrivateRoute,
				},
				{
					path: '/ui/utilities',
					name: 'Utilities',
					element: <Utilities />,
					route: PrivateRoute,
				},
			],
		},
		{
			path: '/extended-ui',
			name: 'Extended UI',
			children: [
				{
					path: '/extended-ui/portlets',
					name: 'Portlets',
					element: <Portlets />,
					route: PrivateRoute,
				},
				{
					path: '/extended-ui/range-slider',
					name: 'Range Slider',
					element: <RangeSlider />,
					route: PrivateRoute,
				},
				{
					path: '/extended-ui/scrollbar',
					name: 'Scrollbar',
					element: <Scrollbar />,
					route: PrivateRoute,
				},
			],
		},
		{
			path: '/ui/icons',
			name: 'Icons',
			children: [
				{
					path: '/ui/icons/remix-icons',
					name: 'Remix Icons',
					element: <RemixIcons />,
					route: PrivateRoute,
				},
				{
					path: '/ui/icons/Bootstrap-icons',
					name: 'Bootstrap Icons',
					element: <BootstrapIcons />,
					route: PrivateRoute,
				},
				{
					path: '/ui/icons/Material-icons',
					name: 'Material Icons',
					element: <MaterialIcons />,
					route: PrivateRoute,
				},
			],
		},
		{
			path: '/charts',
			name: 'Charts',
			children: [
				{
					path: 'charts/apex-charts',
					name: 'Apex Charts',
					element: <ApexCharts />,
					route: PrivateRoute,
				},
				{
					path: 'charts/chartjs',
					name: 'ChartJS',
					element: <ChartJs />,
					route: PrivateRoute,
				},
				{
					path: '/charts/sparkline-charts',
					name: 'Sparkline Charts',
					element: <SparklineCharts />,
					route: PrivateRoute,
				},
			],
		},
		{
			path: '/ui/forms',
			name: 'Forms',
			children: [
				{
					path: '/ui/forms/basic-elements',
					name: 'Basic Elements',
					element: <BasicElements />,
					route: PrivateRoute,
				},
				{
					path: '/ui/forms/form-advanced',
					name: 'Form Advanced',
					element: <FormAdvanced />,
					route: PrivateRoute,
				},
				{
					path: '/ui/forms/validation',
					name: 'Validation',
					element: <Validation />,
					route: PrivateRoute,
				},
				{
					path: '/ui/forms/wizard',
					name: 'Wizard',
					element: <Wizard />,
					route: PrivateRoute,
				},
				{
					path: '/ui/forms/file-uploads',
					name: 'File Uploads',
					element: <FileUploads />,
					route: PrivateRoute,
				},
				{
					path: '/ui/forms/editors',
					name: 'Editors',
					element: <Editors />,
					route: PrivateRoute,
				},
				{
					path: '/ui/forms/image-crop',
					name: 'Image Crop',
					element: <ImageCrop />,
					route: PrivateRoute,
				},
				{
					path: '/ui/forms/editable',
					name: 'Editable',
					element: <Editable />,
					route: PrivateRoute,
				},
			],
		},
		{
			path: '/ui/tables',
			name: 'Tables',
			children: [
				{
					path: '/ui/tables/basic-tables',
					name: 'Basic Tables',
					element: <BasicTables />,
					route: PrivateRoute,
				},
				{
					path: '/ui/tables/data-tables',
					name: 'Data Tables',
					element: <DataTables />,
					route: PrivateRoute,
				},
			],
		},
		{
			path: '/ui/maps',
			name: 'Maps',
			children: [
				{
					path: '/ui/maps/google-maps',
					name: 'Google Maps',
					element: <GoogleMaps />,
					route: PrivateRoute,
				},
				{
					path: '/ui/maps/vector-maps',
					name: 'Vector Maps',
					element: <VectorMaps />,
					route: PrivateRoute,
				},
			],
		},
	],
}

// auth
const authRoutes: RoutesProps[] = [
	{
		path: '/auth/login',
		name: 'Login',
		element: <Login />,
		route: Route,
	},
	{
		path: '/auth/register',
		name: 'Register',
		element: <Register />,
		route: Route,
	},
	{
		path: '/auth/logout',
		name: 'Logout',
		element: <Logout />,
		route: Route,
	},
	{
		path: '/auth/forgot-password',
		name: 'Forgot Password',
		element: <ForgotPassword />,
		route: Route,
	},
	{
		path: '/auth/lock-screen',
		name: 'Lock Screen',
		element: <LockScreen />,
		route: Route,
	},
]

const adminAuthRoutes: RoutesProps[] = [
	{
		path: '/admin/auth/login',
		name: 'Login',
		element: <AdminLogin />,
		route: Route,
	},
]

// public routes
const otherPublicRoutes = [
	{
		path: '*',
		name: 'Error - 404',
		element: <Error404 />,
		route: Route,
	},
	{
		path: 'pages/error-404',
		name: 'Error - 404',
		element: <Error404 />,
		route: Route,
	},
	{
		path: 'pages/error-500',
		name: 'Error - 500',
		element: <Error500 />,
		route: Route,
	},
	{
		path: '/pages/maintenance',
		name: 'Maintenance',
		element: <MaintenancePages />,
		route: Route,
	},
]

// flatten the list of all nested routes
const flattenRoutes = (routes: RoutesProps[]) => {
	let flatRoutes: RoutesProps[] = []

	routes = routes || []
	routes.forEach((item: RoutesProps) => {
		flatRoutes.push(item)
		if (typeof item.children !== 'undefined') {
			flatRoutes = [...flatRoutes, ...flattenRoutes(item.children)]
		}
	})

	return flatRoutes
}

// All routes
const authProtectedRoutes = [dashboardRoutes, customPagesRoutes, uiRoutes, PatientRoutes, MedicineRoutes, NurseRoutes, RoleManagements, EditProfile, VitalChartRoutes, DietchartRoutes, TestReportRoutes, HospitalRoutes, DoctorRoutes]
const publicRoutes = [...authRoutes,...adminAuthRoutes, ...otherPublicRoutes]

const authProtectedFlattenRoutes = flattenRoutes([...authProtectedRoutes])
const publicProtectedFlattenRoutes = flattenRoutes([...publicRoutes])
export {
	publicRoutes,
	authProtectedRoutes,
	authProtectedFlattenRoutes,
	publicProtectedFlattenRoutes,
}
