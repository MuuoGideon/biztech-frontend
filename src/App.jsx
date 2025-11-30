import React from 'react';
import MainLayout from './mainLayout/MainLayout';
import HomePage from './pages/HomePage';
import SalesPage from './pages/SalesPage';
import SalePage, { saleLoader } from './pages/SalePage';
import AddSalePage from './pages/AddSalePage';
import UpdateSalePage from './pages/UpdateSalePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DBboard from './pages/DBoard';
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';

import KPIDashboard from './pages/KPIDashboard';
import SalesPieChart from './pages/SalesPieChart';
import DayWeekDashDB from './pages/DayWeekDashDB';
import TotalQuantityDB from './pages/TotalQuantityDB';

import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from 'react-router-dom';

function App() {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route path='/' element={<MainLayout />}>
				<Route index element={<HomePage />} />
				<Route
					path='/sales'
					element={
						<ProtectedRoute>
							<SalesPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/add-sale'
					element={
						<ProtectedRoute>
							<AddSalePage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/sales/update/:id'
					element={
						<ProtectedRoute>
							<UpdateSalePage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/sales/:id'
					element={
						<ProtectedRoute>
							<SalePage />
						</ProtectedRoute>
					}
					loader={saleLoader}
				/>
				<Route path='/login-user' element={<LoginPage />} />
				<Route path='/sign-up' element={<SignUpPage />} />

				<Route
					path='/kpi_dashboard'
					element={
						<ProtectedRoute>
							<KPIDashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/DayWeekDashDB'
					element={
						<ProtectedRoute>
							<DayWeekDashDB />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/lineChartDB'
					element={
						<ProtectedRoute>
							<KPIDashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/SalesPieChart'
					element={
						<ProtectedRoute>
							<SalesPieChart />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/TotalQuantityDB'
					element={
						<ProtectedRoute>
							<TotalQuantityDB />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/dboard'
					element={
						<ProtectedRoute>
							<DBboard />
						</ProtectedRoute>
					}
				/>
				<Route path='*' element={<NotFoundPage />} />
			</Route>
		)
	);

	return <RouterProvider router={router} />;
}

export default App;
