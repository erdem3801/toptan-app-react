import React from 'react'
import {Link} from 'react-router-dom'



const Login = () => {

    const [user, setUser] = useState({
        user_name = null,
        user_password = null
    })
    const submitHandler = (e) =>{
        e.preventDefault();


    }

    return (
        <div className='hold-transition login-page dark-mode'>
            <div className="login-box">
                {/* /.login-logo */}
                <div className="card card-outline card-primary">
                    <div className="card-header text-center">
                        <Link to="/dashboard" className="h1"> <b>Admin</b> </Link>
                    </div>
                    <div className="card-body">
                        <p className="login-box-msg">Uygulamaya devam etmek için giriş yapın</p>
                        <form  onSubmit={e => submitHandler(e)} id="loginForm">
                            <div className="form-group">
                                <div className="input-group mb-3">
                                    <input type="email" name="email" className="form-control" placeholder="Email" />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-envelope" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-group mb-3">
                                    <input type="password" name="password" className="form-control" placeholder="Password" />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-lock" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                {/* /.col */}
                                <div className="col-12">
                                    <button type="submit" className="btn btn-primary btn-block">Giriş</button>
                                </div>
                                {/* /.col */}
                            </div>
                        </form>
                        {/* /.social-auth-links */}
                        <p className="my-2">
                            <Link to="forgot-password.html">Şifremi unuttum</Link>
                        </p>
                    </div>
                    {/* /.card-body */}
                </div>
                {/* /.card */}
            </div>
            {/* /.login-box */}

        </div>
    )
}

export default Login