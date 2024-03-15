import './leftBar.scss';
import Friends from '../../assets/1.png';
import Groups from '../../assets/2.png';
import Market from '../../assets/3.png';
import Watch from '../../assets/4.png';
import Memories from '../../assets/5.png';
import Events from '../../assets/6.png';
import Gaming from '../../assets/7.png';
import Gallery from '../../assets/8.png';
import Videos from '../../assets/9.png';
import Messages from '../../assets/10.png';
import Tutorials from '../../assets/11.png';
import Courses from '../../assets/12.png';
import Fund from '../../assets/13.png';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { useContext } from 'react';

const LeftBar = () => {
    const { currentUser } = useContext(AuthContext);

    return (
        <div className="leftBar">
            <div className="container">
                <div className="menu">
                    <div className="user">
                        <img src={currentUser.profile_picture} alt="" />
                        <Link
                            to={`/profile/${currentUser.id}`}
                            style={{
                                textDecoration: 'none',
                                color: 'inherit',
                            }}
                        >
                            <span
                                style={{
                                    fontWeight: 'bold',
                                }}
                                className="name"
                            >
                                {currentUser.username}
                            </span>
                        </Link>
                    </div>
                </div>
                <hr />
                <div className="menu">
                    <span>Your shortcuts</span>
                    <Link to="/followers">
                        <div className="item">
                            <img src={Groups} alt="" />
                            <span>Followers</span>
                        </div>
                    </Link>
                    <Link to="/followings">
                        <div className="item">
                            <img src={Friends} alt="" />
                            <span>Followings</span>
                        </div>
                    </Link>
                    <Link to="/blocked-users">
                        <div className="item">
                            <img src={Memories} alt="" />
                            <span>Blocked users</span>
                        </div>
                    </Link>
                    <Link to="/my-stories">
                        <div className="item">
                            <img src={Gallery} alt="" />
                            <span>Your stories</span>
                        </div>
                    </Link>
                    <Link to="/messages">
                        <div className="item">
                            <img src={Messages} alt="" />
                            <span>Messages</span>
                        </div>
                    </Link>
                </div>
                <hr />
            </div>
        </div>
    );
};

export default LeftBar;
