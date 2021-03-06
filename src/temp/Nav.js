import React from 'react'
import {Link} from 'react-router-dom'



const Nav = () => {
    return (
        <>
            <nav className="main-header navbar navbar-expand-md navbar-light navbar-dark">
                <div className="container">
                    <Link to="/" className="navbar-brand">
                        <img src="./dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
                        <span className="brand-text font-weight-light">Toptan App</span>
                    </Link>
                    <button className="navbar-toggler order-1" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse order-3" id="navbarCollapse">
                        {/* Left navbar links */}
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                            </li>
                            <li className="nav-item">
                                <a href="/items" className="nav-link">Ürünler</a>
                            </li>
                            <li className="nav-item dropdown">
                                <Link id="dropdownSubMenu1"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" className="nav-link dropdown-toggle">Listeler</Link>
                                <ul aria-labelledby="dropdownSubMenu1" className="dropdown-menu border-0 shadow">
                                    <li>
                                        <Link to="/list/customer" className="dropdown-item">Müşteri Listesi </Link>
                                    </li>
                                    <li>
                                        <Link to="/list/order" className="dropdown-item">Sipariş Listesi</Link>
                                    </li>
                                    <li>
                                        <Link to="/list/catalog" className="dropdown-item">Katalog Listesi</Link>
                                    </li>
                                    {/* <li class="dropdown-divider"></li> */}
                                </ul>
                            </li>
                            <li className="nav-item dropdown">
                                <a id="dropdownSubMenu1" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" className="nav-link dropdown-toggle">Ayarlar</a>
                                <ul aria-labelledby="dropdownSubMenu1" className="dropdown-menu border-0 shadow">
                                    <li>
                                        <Link to="/companyprofile" className="dropdown-item">Firma profili</Link></li>
                                    <li><Link to="/users" className="dropdown-item">Kullanıcılar</Link></li>
                                    <li><Link to="/units" className="dropdown-item">Ölçüt Birimleri</Link></li>
                                    <li><Link to="/currentcy" className="dropdown-item">Para Birimleri</Link></li>
                                    <li><Link to="/cities" className="dropdown-item">Şehirler</Link></li>
                                    <li><Link to="/regions" className="dropdown-item">Bölgeler</Link></li>
                                    {/* <li class="dropdown-divider"></li> */}
                                </ul>
                            </li>
                        </ul>
                    </div>
                    {/* Right navbar links */}
                    <ul className="order-1 order-md-3 navbar-nav navbar-no-expand ml-auto">
                        {/* Messages Dropdown Menu */}
                        <li className="nav-item dropdown">
                            <Link className="nav-link" data-toggle="dropdown" >
                                <i className="fas fa-cart-arrow-down" />
                                <span className="badge badge-danger navbar-badge order-count">0</span>
                            </Link>
                            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right dropdown-order">
                                <div className="dropdown-item dropdown-order-item" style={{ display: 'none' }}>
                                    {/* Message Start */}
                                    <div className="media">
                                        <img src="./dist/img/default/no-user-origi.png" alt="User Avatar" className="img-size-50 mr-3 img-circle thumbnail" />
                                        <div className="media-body">
                                            <h3 className="dropdown-item-title">
                                                <div className="title" />
                                                <span className="float-right text-sm text-danger" data-role="order-delete" data-id="-"><i className="fas fa-trash" /></span>
                                            </h3>
                                            <p className="text-sm total-price">Fiyat :<span /></p>
                                            <p className="text-sm text-muted"><i className="far fa-clock mr-1" /> <span className="elapsed-time"> g</span> </p>
                                        </div>
                                    </div>
                                    {/* Message End */}
                                </div>
                                <div className="dropdown-divider" />
                                <a href="#" className="dropdown-item dropdown-footer dropdown-order-footer">Tüm Siparişleri Gör</a>
                            </div>
                        </li>
                        {/* Notifications Dropdown Menu */}
                        <li className="nav-item dropdown">
                            <a className="nav-link" data-toggle="dropdown" href="#">
                                <i className="far fa-bell" />
                                <span className="badge badge-warning navbar-badge">15</span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                                <span className="dropdown-header">15 yeni bildirim</span>
                                <div className="dropdown-divider" />
                                <a href="#" className="dropdown-item">
                                    <i className="fas fa-envelope mr-2" /> 4 yeni mesaj
                                    <span className="float-right text-muted text-sm">3 dakika</span>
                                </a>
                                <div className="dropdown-divider" />
                                <a href="#" className="dropdown-item">
                                    <i className="fas fa-users mr-2" /> 8 yeni müşteri
                                    <span className="float-right text-muted text-sm">12 saat</span>
                                </a>
                                <div className="dropdown-divider" />
                                <a href="#" className="dropdown-item">
                                    <i className="fas fa-file mr-2" /> 3 yeni sipariş
                                    <span className="float-right text-muted text-sm">2 gün</span>
                                </a>
                                <div className="dropdown-divider" />
                                <a href="#" className="dropdown-item dropdown-footer">Tüm bildirimler gör</a>
                            </div>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/login" role="button">
                                <i className="fas fa-sign-out-alt" />
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>


        </>
    )
}

export default Nav
