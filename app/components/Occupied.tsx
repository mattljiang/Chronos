import React, { useContext, useEffect, useState, useRef, forwardRef } from 'react';

// MATERIAL UI METHODS
import {
  IconButton,
  Modal,
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography
} from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { BaseCSSProperties } from '@material-ui/core/styles/withStyles';

// MATERIAL UI ICONS
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddCircleOutlineTwoToneIcon from '@material-ui/icons/AddCircleOutlineTwoTone';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import ListIcon from '@material-ui/icons/List';
import SearchIcon from '@material-ui/icons/Search';
import DashboardIcon from '@material-ui/icons/Dashboard';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PersonIcon from '@material-ui/icons/Person';
import UpdateIcon from '@material-ui/icons/Update';

// MODALS
import AddModal from '../modals/AddModal';
import ServicesModal from '../modals/ServicesModal';

// STYLESHEETS
// import '../stylesheets/Occupied.scss';
import '../stylesheets/Occupied.scss';

// DASHBOARD CONTEXT
import { DashboardContext } from '../context/DashboardContext';

import { ApplicationContext } from '../context/ApplicationContext';

// TYPESCRIPT
interface StyleProps {
  root: BaseCSSProperties;
}
type ClickEvent = React.MouseEvent<HTMLElement>;

const Occupied = React.memo(() => {
  const { setServicesData } = useContext(ApplicationContext);
  const { applications, getApplications, deleteApp } = useContext(DashboardContext);
  const [open, setOpen] = useState<boolean>(false);
  const [addOpen, setAddOpen] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const [app, setApp] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('Search...');
  //TODO: learn more about useRef
  // Dynamic refs
  const delRef = useRef<any>([]);

  //? when page re-renders, set servicesData to be empty?
  useEffect(() => {
    setServicesData([]);
    getApplications();
  }, []);

  // Ask user for deletion confirmation
  const confirmDelete = (event: ClickEvent, app: string, i: number) => {
    const message = `The application '${app}' will be permanently deleted. Continue?`;
    if (confirm(message)) deleteApp(i);
  };

  // Handle clicks on Application cards
  const handleClick = (event: ClickEvent, selectedApp: string, i: number) => {
    if (delRef.current[i] && !delRef.current[i].contains(event.target)) {
      setIndex(i);
      setApp(selectedApp);
      setServicesData([]);
      setOpen(true);
    }
  };

  const useStyles = makeStyles<Theme, StyleProps>(theme => ({
    // ALL CARDS
    paper: {
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'visible',
      height: 280,
      width: 280,
      textAlign: 'center',
      color: '#888888',
      whiteSpace: 'nowrap',
      backgroundColor: '#ffffff',
      borderRadius: 3,
      border: '0',
      boxShadow:
        '0 6px 6px 0 rgba(153, 153, 153, 0.14), 0 6px 6px -2px rgba(153, 153, 153, 0.2), 0 6px 8px 0 rgba(153, 153, 153, 0.12)',
      '&:hover, &.Mui-focusVisible': {
        backgroundColor: `#3788fc`,
        color: '#ffffff',
        fontWeight: 600,
      },
    },
    iconbutton: {
      boxShadow: 'none',
      color: 'none',
      visibility: 'hidden',
    },
    btnStyle: {
      position: 'absolute',
      top: -10,
      left: -72,
      margin: '0',
      color: '#eeeeee',
      borderRadius: '0',
      backgroundColor: 'none',
      visibility: 'visible',
    },
    icon: {
      width: '75px',
      height: '75px',
      boxShadow: 'none',
    },
    // ALL CARDS: CONTENT
    fontStyles: {
      fontSize: '18px',
      fontFamily: 'Roboto',
      fontWeight: 300,
      color: '#444d56',
    }
  }));

  const classes = useStyles({} as StyleProps);

  return (
    <div className="entireArea">
      <div className="dashboardArea">
        <header className="mainHeader">
          <section className="header" id="leftHeader">
            <span>
              <ListIcon className="icon" id="listIcon" />
            </span>
            <span>
              <p id="dashboard">Dashboard</p>
            </span>
          </section>
          <section className="header" id="rightHeader">
            <form className="form">
              <label className="inputContainer">
                <input className="form" id="textInput" placeholder={searchTerm} onChange={e => setSearchTerm(e.target.value)} type="text" name="search" />
                <hr />
              </label>
              <button className="form" id="submitBtn" type="submit">
                <SearchIcon className="icon" id="searchIcon" />
              </button>
            </form>
            <div className="dashboardIconArea">
              <span className="dashboardTooltip">You have {applications.length} active databases</span>
              <DashboardIcon className="navIcon" id="dashboardIcon" />
            </div>
            
            <div className="notificationsIconArea">
              <span className="notificationsTooltip">You have no new alerts</span>
              < NotificationsIcon className="navIcon" id="notificationsIcon" />
            </div>

            <div className="personIconArea">
              <span className="personTooltip">You are not logged in</span>
              <PersonIcon className="navIcon" id="personIcon" />
            </div>
          </section>
        </header>

        <div className="cardContainer">
          <div className="card" id={`card-add`}>
            <Button className={classes.paper} onClick={() => setAddOpen(true)}>
              <AddCircleOutlineTwoToneIcon className={classes.icon} />
            </Button>
          </div>
          {applications.map((app: string[], i: number | any | string | undefined) => (
            <div className="card" key={`card-${i}`} id={`card-${i}`}>
              <Card
                key={`card-${i}`}
                className={classes.paper}
                variant="outlined"
                onClick={event => handleClick(event, app[0], i)}
              >

                  <div className="databaseIconContainer">
                    <div className="databaseIconHeader">
                      <img className="databaseIcon" src="../assets/mongo-icon-white.png" alt="MongoDB"></img>
                    </div>
                  </div>
                  
                  {/* //?i don't see iconbutton and highlightofficon on the screen */}
                  <CardHeader
                    avatar={
                      <IconButton
                        id="iconButton"
                        ref={element => (delRef.current[i] = element)}
                        className={classes.iconbutton}
                        aria-label="Delete"
                        onClick={event => confirmDelete(event, app[0], i)}
                      >
                        <HighlightOffIcon 
                        className={classes.btnStyle} 
                        id="deleteIcon" 
                        ref={element => (delRef.current[i] = element)} 
                        />
                      </IconButton>
                    }
                  >
                  </CardHeader>
                <CardContent>
                  <p id="databaseName">Database Name:</p>
                  <Typography className={classes.fontStyles}>{app[0]}</Typography>
                </CardContent>
                <hr className="cardLine"/>

                <div className="cardFooter">
                  {/* does updateicon do anything right now */}
                  <UpdateIcon className="cardFooterIcon"/>
                  <em><p id="cardFooterText">Just updated</p></em>
                </div>
              </Card>
            </div>
          ))}
          //?does addmodal have to be different than modal
          <Modal open={addOpen} onClose={() => setAddOpen(false)}>
            <AddModal setOpen={setAddOpen} />
          </Modal>
          <Modal open={open} onClose={() => setOpen(false)}>
            <ServicesModal key={`key-${index}`} i={index} app={app} />
          </Modal>
        </div>
      </div>
    </div>
  );
});

export default Occupied;
