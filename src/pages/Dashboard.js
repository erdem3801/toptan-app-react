import React from 'react'
const Dashboard = () => {
    return (
        <>
            <div className="content mt-3">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-sm-6 col-md-3">
                            <div className="info-box">
                                <span className="info-box-icon bg-info elevation-1"><i className="fas fa-cog" /></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Sipariler</span>
                                    <span className="info-box-number order-count">0</span>
                                </div>
                                {/* /.info-box-content */}
                            </div>
                            {/* /.info-box */}
                        </div>
                        {/* /.col */}
                        <div className="col-12 col-sm-6 col-md-3">
                            <div className="info-box mb-3">
                                <span className="info-box-icon bg-danger elevation-1"><i className="fas fa-shopping-cart" /></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Ürün sayısı</span>
                                    <span className="info-box-number catalog-count">41,410</span>
                                </div>
                                {/* /.info-box-content */}
                            </div>
                            {/* /.info-box */}
                        </div>
                        {/* /.col */}
                        {/* fix for small devices only */}
                        <div className="clearfix hidden-md-up" />
                        <div className="col-12 col-sm-6 col-md-3">
                            <div className="info-box mb-3">
                                <span className="info-box-icon bg-success elevation-1"><i className="fas fa-clipboard-check" /></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Satışlar</span>
                                    <span className="info-box-number">760</span>
                                </div>
                                {/* /.info-box-content */}
                            </div>
                            {/* /.info-box */}
                        </div>
                        {/* /.col */}
                        <div className="col-12 col-sm-6 col-md-3">
                            <div className="info-box mb-3">
                                <span className="info-box-icon bg-warning elevation-1"><i className="fas fa-users" /></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">Müşteriler</span>
                                    <span className="info-box-number customer-count">0</span>
                                </div>
                                {/* /.info-box-content */}
                            </div>
                            {/* /.info-box */}
                        </div>
                        {/* /.col */}
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title">Aylık Faliyet Raporu</h5>
                                    <div className="card-tools">
                                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                            <i className="fas fa-minus" />
                                        </button>
                                        <div className="btn-group">
                                            <button type="button" className="btn btn-tool dropdown-toggle" data-toggle="dropdown">
                                                <i className="fas fa-wrench" />
                                            </button>
                                            <div className="dropdown-menu dropdown-menu-right" role="menu">
                                                <a href="#" className="dropdown-item">Action</a>
                                                <a href="#" className="dropdown-item">Another action</a>
                                                <a href="#" className="dropdown-item">Something else here</a>
                                                <a className="dropdown-divider" />
                                                <a href="#" className="dropdown-item">Separated link</a>
                                            </div>
                                        </div>
                                        <button type="button" className="btn btn-tool" data-card-widget="remove">
                                            <i className="fas fa-times" />
                                        </button>
                                    </div>
                                </div>
                                {/* /.card-header */}
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <p className="text-center">
                                                <strong>Satış: 01.11.2014 - 01.12.2014</strong>
                                            </p>
                                            <div className="chart">
                                                <div className="chartjs-size-monitor">
                                                    <div className="chartjs-size-monitor-expand">
                                                        <div className />
                                                    </div>
                                                    <div className="chartjs-size-monitor-shrink">
                                                        <div className />
                                                    </div>
                                                </div>
                                                {/* Sales Chart Canvas */}
                                                <canvas id="salesChart" height={225} style={{ height: 180, display: 'block', width: 502 }} width={627} className="chartjs-render-monitor" />
                                            </div>
                                            {/* /.chart-responsive */}
                                        </div>
                                        {/* /.col */}
                                        <div className="col-md-4">
                                            <div className="progress-group title">
                                                <strong>Genel İstatistik</strong>
                                                <span className="float-right"><b>Tamamlanan</b>/Hedef</span>
                                            </div>
                                            <div className="progress-group">
                                                İstek Listesine Eklenen Ürün
                                                <span className="float-right"><b>160</b>/200</span>
                                                <div className="progress progress-sm">
                                                    <div className="progress-bar bg-primary" style={{ width: '80%' }} />
                                                </div>
                                            </div>
                                            {/* /.progress-group */}
                                            <div className="progress-group">
                                                Satışı Tamamlanana Ürün
                                                <span className="float-right"><b>310</b>/400</span>
                                                <div className="progress progress-sm">
                                                    <div className="progress-bar bg-danger" style={{ width: '75%' }} />
                                                </div>
                                            </div>
                                            {/* /.progress-group */}
                                            <div className="progress-group">
                                                <span className="progress-text">Ziyaret Edilen Müşteri</span>
                                                <span className="float-right"><b>480</b>/800</span>
                                                <div className="progress progress-sm">
                                                    <div className="progress-bar bg-success" style={{ width: '60%' }} />
                                                </div>
                                            </div>
                                            {/* /.progress-group */}
                                            <div className="progress-group">
                                                Tamamlanmayı Bekleyen Ürün
                                                <span className="float-right"><b>250</b>/500</span>
                                                <div className="progress progress-sm">
                                                    <div className="progress-bar bg-warning" style={{ width: '50%' }} />
                                                </div>
                                            </div>
                                            {/* /.progress-group */}
                                        </div>
                                        {/* /.col */}
                                    </div>
                                    {/* /.row */}
                                </div>
                                {/* ./card-body */}
                                <div className="card-footer">
                                    <div className="row">
                                        <div className="col-sm-3 col-6">
                                            <div className="description-block border-right">
                                                <span className="description-percentage text-success"><i className="fas fa-caret-up" /> 17%</span>
                                                <h5 className="description-header">$35,210.43</h5>
                                                <span className="description-text">TOTAL REVENUE</span>
                                            </div>
                                            {/* /.description-block */}
                                        </div>
                                        {/* /.col */}
                                        <div className="col-sm-3 col-6">
                                            <div className="description-block border-right">
                                                <span className="description-percentage text-warning"><i className="fas fa-caret-left" /> 0%</span>
                                                <h5 className="description-header">$10,390.90</h5>
                                                <span className="description-text">TOTAL COST</span>
                                            </div>
                                            {/* /.description-block */}
                                        </div>
                                        {/* /.col */}
                                        <div className="col-sm-3 col-6">
                                            <div className="description-block border-right">
                                                <span className="description-percentage text-success"><i className="fas fa-caret-up" /> 20%</span>
                                                <h5 className="description-header">$24,813.53</h5>
                                                <span className="description-text">TOTAL PROFIT</span>
                                            </div>
                                            {/* /.description-block */}
                                        </div>
                                        {/* /.col */}
                                        <div className="col-sm-3 col-6">
                                            <div className="description-block">
                                                <span className="description-percentage text-danger"><i className="fas fa-caret-down" /> 18%</span>
                                                <h5 className="description-header">1200</h5>
                                                <span className="description-text">GOAL COMPLETIONS</span>
                                            </div>
                                            {/* /.description-block */}
                                        </div>
                                    </div>
                                    {/* /.row */}
                                </div>
                                {/* /.card-footer */}
                            </div>
                            {/* /.card */}
                        </div>
                        {/* /.col */}
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header border-transparent">
                                    <h3 className="card-title">Sipariş Listesi</h3>
                                    <div className="card-tools">
                                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                            <i className="fas fa-minus" />
                                        </button>
                                        <button type="button" className="btn btn-tool" data-card-widget="remove">
                                            <i className="fas fa-times" />
                                        </button>
                                    </div>
                                </div>
                                {/* /.card-header */}
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table className="table m-0">
                                            <thead>
                                                <tr>
                                                    <th>Sipariş ID</th>
                                                    <th>Ürün</th>
                                                    <th>Durum</th>
                                                    <th>Tutar</th>
                                                </tr>
                                            </thead>
                                            <tbody className="order-table-body">
                                                <tr className="first-element">
                                                    <td className="order-id"><a href="pages/examples/invoice.html">OR9842</a></td>
                                                    <td className="order-name">Call of Duty IV</td>
                                                    <td className="order-status"><span className="badge badge-success">Shipped</span></td>
                                                    <td className="order-price"> 100 ₺</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* /.table-responsive */}
                                </div>
                                {/* /.card-body */}
                                <div className="card-footer clearfix">
                                    <a href="javascript:void(0)" className="btn btn-sm btn-info float-left">Place New Order</a>
                                    <a href="javascript:void(0)" className="btn btn-sm btn-secondary float-right">View All Orders</a>
                                </div>
                                {/* /.card-footer */}
                            </div>
                        </div>
                    </div>
                    {/* /.row */}
                </div>{/* /.container-fluid */}
            </div>
        </>
    )
}
export default Dashboard
