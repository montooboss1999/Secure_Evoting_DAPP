import React, { useEffect, useState } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";
import Button from "components/CustomButtons/Button";
import Datetime from "react-datetime";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import { Check as CheckIcon } from "react-feather";
import { Home as HomeIcon } from "react-feather";
import CloseIcon from "@material-ui/icons/Close";
import styles from "../../assets/jss/material-kit-react/views/profilePage.js";
import { registerToVote } from "core/utils/utils.js";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { ballotSetup } from "core/utils/utils.js";
import CustomTables from "./Table.js";
import { voteForCandidate } from "core/utils/utils.js";
import { getData } from "core/utils/utils.js";
const useStyles = makeStyles(styles);

export default function Ballot(props) {
  const classes = useStyles();
  const {
    location: {
      state: { proData: profileObj, data, title, ballotid },
    },
  } = props;
  const [vote_data, setVoteData] = useState({ data: [] });
  useEffect(() => {
    setVoteData({ data: data });
  }, []);
  console.log(vote_data);
  const obj = useSelector((o) => o);
  const imageClasses = classNames(
    classes.imgRaised,
    classes.imgRoundedCircle,
    classes.imgFluid
  );
  const { enqueueSnackbar } = useSnackbar();
  const [vote, setVote] = useState({
    candidate: "",
    email: profileObj["email"],
    obj: obj,
    ballotID: ballotid,
  });
  const tableData = [];
  vote_data["data"].map((v) => {
    tableData.push({ candidateID: v.id, candidateName: v.name });
  });
  const onLoad = (i, data) => {
    if (i != "success") {
      enqueueSnackbar(i, { variant: "error" });
    } else {
      setVoteData(data);
    }
  };
  // console.log(vote);
  const handleLoad = () => {
    getData({ ballotID: ballotid, onLoad: onLoad, obj: obj });
  };
  const onVote = (i) => {
    enqueueSnackbar("Your vote hase been casted.", { variant: "success" });
    handleLoad();
  };
  const handleVote = () => {
    voteForCandidate({ ...vote, onVote: onVote });
  };
  return (
    <div>
      <div className={classes.navigation}>
        <Header
          color="transparent"
          brand={`Ballot - ${ballotid}`}
          fixed
          changeColorOnScroll={{
            height: 200,
            color: "white",
          }}
          rightLinks={
            <List className={classes.list}>
              <ListItem className={classes.listItem}>
                <Button
                  href="/profile"
                  color="transparent"
                  className={classes.navLink}
                  style={{
                    fontSize: "1em",
                  }}
                  startIcon={<HomeIcon />}
                >
                  Back to Profile
                </Button>
              </ListItem>
            </List>
          }
        />
      </div>

      <Parallax
        small
        filter
        image={require("../../assets/img/profile-bg.jpg").default}
      />
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div>
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12}>
                <div className={classes.profile}>
                  <div>
                    <img
                      src={profileObj["imageUrl"]}
                      alt="..."
                      className={imageClasses}
                    />
                  </div>
                  <div className={classes.name}>
                    <Typography
                      className={classes.title}
                      style={{
                        textAlign: "center",
                        width: "100%",
                        marginBottom: -10,
                      }}
                      variant="h4"
                    >
                      {profileObj["name"]}
                    </Typography>
                    <h5
                      className={classes.title}
                      style={{ textAlign: "center" }}
                    >
                      {profileObj["email"]}
                    </h5>
                  </div>
                </div>
              </GridItem>
              <GridItem xs={12}>
                <Box display="flex" width="100%" justifyContent="center" py={4}>
                  <Typography variant={"h3"}>Candidates</Typography>
                </Box>
              </GridItem>
              <GridItem xs={12}>
                <Box display="flex" width="100%" justifyContent="center" py={4}>
                  <CustomTables
                    rows={tableData}
                    selectCandidate={(i) =>
                      setVote({ ...vote, candidate: i.name })
                    }
                  />
                </Box>
              </GridItem>
              <GridItem xs={12}>
                <Box display="flex" width="100%" justifyContent="center" py={4}>
                  <Button onClick={handleVote}>Vote</Button>
                </Box>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
