import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import AddNewTransaction from '../AddNewTransaction/AddNewTransaction'
import HomePage from '../../page/HomePage/HomePage'
import VehicleSchedulePage from '../../page/VehicleSchedulePage/VehicleSchedulePage'
import GroupsPage from '../../page/GroupsPage/GroupsPage'
import UsersPage from '../../page/UsersPage/UsersPage'
import ReportsPage from '../../page/ReportsPage/ReportsPage'

const Layout = () => {
  const [activeTab, setActiveTab] = useState('transactions')

  const renderContent = () => {
    switch (activeTab) {
      case 'transactions':
        return <HomePage />
      case 'vehicle-schedule':
        return <VehicleSchedulePage />
      case 'groups':
        return <GroupsPage />
      case 'users':
        return <UsersPage />
      case 'reports':
        return <ReportsPage />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="min-h-screen bg-gray-25">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <Header />
      <div className="ml-72 pt-16 min-h-screen">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
      <AddNewTransaction />
    </div>
  )
}

export default Layout
