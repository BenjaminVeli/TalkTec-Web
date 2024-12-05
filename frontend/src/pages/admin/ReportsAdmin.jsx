import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import HeaderAdmin from "../../components/HeaderAdmin";

import Departments from "../../components/admin/Reports/Departments";
import UsersWeek from "../../components/admin/Reports/UsersWeek";
import PublicationMounthly from "../../components/admin/Reports/PublicationMounthly";
import TenPublicationsLike from "../../components/admin/Reports/TenPublicationsLike";
import CommentsWeek from "../../components/admin/Reports/CommentsWeek";
import FivePublicationsComments from "../../components/admin/Reports/FivePublicationsComments";

import { UserCheck2,UserMinus2,FileText,ArrowUp, ArrowDown } from "lucide-react";

import "./../styles/kpi-styles.css"
import { getUsersCount } from "../../api/users";

const ReportsAdmin = () => {
  const [usersCount, setUsersCount ] =  useState({ active_users: 0 , deactive_users: 0});

  useEffect(() => {
    const fetchUsersCount = async () => {
      try {
        const data = await getUsersCount();
        setUsersCount(data);
      } catch (error) {
        console.error('Error getting users counts:', error);
      }
    };

    fetchUsersCount();
  }, []);

  return (
    <div>
      <Helmet>
        <title>TecsupNet | Admin Panel - Reports</title>
      </Helmet>
      <HeaderAdmin/>

      <main>
        <div className="container-dashboard">
          <div className="cards-container">
            <div className="card-overview">
              <UserCheck2 size={32} className="card-overview-svg1"/>
              <div className="card-overview-content">
                <div>
                  <h4 className="card-overview-h4">{usersCount.active_users}</h4>
                  <span className="card-overview-span">Usuarios Activos</span>
                </div>
                <ArrowUp size={16} className="arrow-green"/>
              </div>
            </div>
            <div className="card-overview">
              <UserMinus2 size={32} className="card-overview-svg2"/>
              <div className="card-overview-content">
                <div>
                  <h4 className="card-overview-h4">{usersCount.deactive_users}</h4>
                  <span className="card-overview-span">Usuarios Inactivos</span>
                </div>
                <ArrowDown size={16} className="arrow-red"/>
              </div>
            </div>
            <div className="card-overview">
              <FileText size={32} className="card-overview-svg3"/>
              <div className="card-overview-content">
                <div>
                  <h4 className="card-overview-h4">{usersCount.total_publications}</h4>
                  <span className="card-overview-span">Total Publicaciones</span>
                </div>
                <ArrowUp size={16} className="arrow-green"/>
              </div>
            </div>
          </div>
          <div className="dashboard-graphics">
            <div className="graphic-chart">
              <div className="graphic-chart-text">
                <h4 className="graphic-chart-h4">Departamentos escogidos por usuarios</h4>
              </div>
              <Departments/>
            </div>
            <div className="graphic-chart2">
              <div className="graphic-chart-text">
                <h4 className="graphic-chart-h4">Publicaciones por mes</h4>
              </div>
              <PublicationMounthly/>
            </div>
            <div className="graphic-chart2">
              <div className="graphic-chart-text">
                <h4 className="graphic-chart-h4">Usuarios nuevos en la semana</h4>
              </div>
              <UsersWeek/>
            </div>
            <div className="graphic-chart">
              <div className="graphic-chart-text">
                <h4 className="graphic-chart-h4">Likes en las 10 publicaciones más populares</h4>
              </div>
              <TenPublicationsLike/>
            </div>
            <div className="graphic-chart2">
              <div className="graphic-chart-text">
                <h4 className="graphic-chart-h4">Top 5 publicaciones por la cantidad de comentarios</h4>
              </div>
              <FivePublicationsComments/>
            </div>
            <div className="graphic-chart">
              <div className="graphic-chart-text">
                <h4 className="graphic-chart-h4">Comentarios en publicaciones por día de la semana</h4>
              </div>
              <CommentsWeek/>
            </div>
          </div>
        </div>
      </main>

    </div>
  )
}

export default ReportsAdmin