import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import Spinner from "./Spinner";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

import {
  useFilterDashboardByDateQuery,
  useGetDashboardCountQuery,
} from "../services/Post";

import { useGetDashboardAllQuery } from "../services/Post";

function DashboardNew(props) {
  const [loading, setLoading] = useState(true);
  const { data: dashboardlist } = useGetDashboardAllQuery();
  const { data: dashboardCount } = useGetDashboardCountQuery();
  console.log(" dashboardlist ", dashboardlist);
  const [dashBoardList, setDashboardList] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const { data: filteredDashboard, isLoading } = useFilterDashboardByDateQuery(
    {
      from: fromDate,
      to: toDate,
    },
    {
      skip: !fromDate || !toDate,
    }
  );
  console.log("fromDate:", fromDate);
  console.log("toDate:", toDate);
  console.log("filteredDashboard ", filteredDashboard);

  axios.defaults.headers.common["x-auth-token-admin"] =
    localStorage.getItem("token");

  useEffect(() => {
    props.setProgress(10);
    setLoading(true);
    axios
      .post("https://www.techgropsedev.com:2053/admin/dashboards-home")
      .then((response) => {
        setDashboardList(response?.data?.results?.listData.reverse());
        console.log(response.data);
        props.setProgress(100);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (dashboardCount) {
      setTotalRevenue(dashboardCount?.results?.orderRevenue);
      const calculatedTotalRevenue = dashboardCount.results.orderRevenue.reduce(
        (sum, item) => sum + (item.total || 0),
        0
      );
      setTotalRevenue(calculatedTotalRevenue);
    }
  }, [dashboardCount]);

  const handleDateFilter = async () => {
    if (filteredDashboard?.results?.listData) {
      setDashboardList(filteredDashboard?.results?.listData || []);
      console.log(
        "filteredDashboard.results.listData",
        filteredDashboard.results.listData
      );
    }
  };
  console.log(
    "filteredDashboard.results.listData",
    filteredDashboard?.results?.listData
  );

  useEffect(() => {
    if (filteredDashboard?.results?.listData) {
      setDashboardList(filteredDashboard.results.listData);
    }
  }, [filteredDashboard]);

  return (
    <>
      {loading}
      <Sidebar Dash={"dashboard"} />
      <div className="admin_main">
        <div className="admin_main_inner">
          <div className="admin_panel_data height_adjust">
            <div className="row dashboard_part justify-content-center">
              <div className="col-12">
                <div className="row ms-0 mb-3 justify-content-start">
                  <div className="col-4 d-flex align-items-stretch mb-4">
                    <a href="#" className="row dashboard_box box_design w-100">
                      <div className="col-auto px-0">
                        <span className="dashboard_icon">
                          <i className="fas fa-user" />
                        </span>
                      </div>
                      <div className="col pe-0">
                        <div className="dashboard_boxcontent">
                          <h2>Total Users</h2>
                          <span> {dashboardCount?.results?.countUser} </span>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="col-4 d-flex align-items-stretch mb-4">
                    <a href="#" className="row dashboard_box box_design w-100">
                      <div className="col-auto px-0">
                        <span className="dashboard_icon">
                          <i className="far fa-dollar-sign" />
                        </span>
                      </div>
                      <div className="col pe-0">
                        <div className="dashboard_boxcontent">
                          <h2>Total Revenue</h2>
                          <span>{totalRevenue} </span>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="col-4 d-flex align-items-stretch mb-4">
                    <a href="#" className="row dashboard_box box_design w-100">
                      <div className="col-auto px-0">
                        <span className="dashboard_icon">
                          <i className="fas fa-file-alt" />
                        </span>
                      </div>
                      <div className="col pe-0">
                        <div className="dashboard_boxcontent">
                          <h2>Open Support Tickets</h2>
                          <span>
                            {" "}
                            {dashboardCount?.results?.supportsTicket}{" "}
                          </span>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="row mx-0">
                  <div className="col-12 design_outter_comman shadow">
                    <div className="row comman_header justify-content-between">
                      <div className="col-auto">
                        <h2>Recent Orders</h2>
                      </div>
                    </div>
                    <form
                      className="form-design py-4 px-3 help-support-form row align-items-end justify-content-between"
                      action=""
                    >
                      <div className="form-group mb-0 col-5">
                        <label htmlFor="fromDate">From</label>
                        <input
                          type="date"
                          className="form-control"
                          id="fromDate"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                        />
                      </div>
                      <div className="form-group mb-0 col-5">
                        <label htmlFor="toDate">To</label>
                        <input
                          type="date"
                          className="form-control"
                          id="toDate"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                        />
                      </div>
                      <div className="form-group mb-0 col-auto">
                        <Link
                          className="comman_btn"
                          
                          disabled
                        >
                          <span>Search</span>
                        </Link>
                      </div>
                    </form>
                    {loading ? (
                      <Spinner />
                    ) : (
                      <div className="row">
                        <div className="col-12 comman_table_design px-0">
                          <div className="table-responsive">
                            <table className="table mb-0">
                              <thead>
                                <tr>
                                  <th>S.No.</th>
                                  <th>User NAME</th>
                                  <th>Mobile Number</th>
                                  <th>Order Date</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {dashBoardList?.map((item, index) => {
                                  return (
                                    <tr key={index}>
                                      <td>{index + 1} </td>
                                      <td>
                                        {" "}
                                        {item?.firstName} {item?.lastName}{" "}
                                      </td>
                                      <td>+966 9876543210</td>
                                      <td> {item?.createdAt?.slice(0, 10)} </td>
                                      <td>
                                        <Link
                                          className="comman_btn table_viewbtn"
                                          to={`/recent-order/${encodeURIComponent(
                                            JSON.stringify(item)
                                          )}`}
                                        >
                                          <span>View</span>
                                        </Link>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardNew;
