import React, { useState } from "react";
import Head from "next/head";
import {
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addToCounter } from "@/utils/slices/sampleSlice";

export default function HomePage() {
  // Global state
  const count = useSelector((state) => state.sample.count);
  const dispatch = useDispatch();

  // Local state
  const [textValue, setTextValue] = useState("");

  // Callback functions
  const onButtonPress = () => {
    alert("You pressed a button!");
  };

  const onOtherButtonPress = () => {
    alert(`The text field says this: ${textValue}`);
  };

  const incrementCounter = () => {
    dispatch(addToCounter(1));
  };

  const decrementCounter = () => {
    dispatch(addToCounter(-1));
  };

  // Page content
  return (
    <>
      <Head>
        <title>Home Page</title>
      </Head>

      <main>
        <Stack sx={{ paddingTop: 4 }} alignItems="center" gap={2}>
          <Card sx={{ width: 600 }} elevation={4}>
            <CardContent>
              <Typography variant="h3" align="center">
                Pet Adoption Spring 2025
              </Typography>
              <Typography variant="body1" color="text.secondary">
                This is your template project for the Spring 2025 Baylor
                Software Engineering II class project! See the README for
                instructions on how to set this project up and run it locally.
              </Typography>
            </CardContent>
          </Card>
          <Stack alignItems="center" gap={2}>
            {/* There are multiple ways to apply styling to Material UI components. One way is using the `sx` prop: */}
            <Button
              variant="contained"
              onClick={onButtonPress}
              sx={{ width: 200 }}
            >
              I am a button
            </Button>

            {/* Another way is by creating a dedicated CSS file and using the styles from there: */}
            <Button
              variant="contained"
              color="secondary"
              onClick={onOtherButtonPress}
              className={styles.wideButton}
            >
              I am a wider button
            </Button>

            {/* Here is an input field */}
            <TextField
              type="text"
              variant="outlined"
              label="Text Field"
              value={textValue}
              onChange={(event) => setTextValue(event.target.value)}
            />

            {/* Here is a link to another page */}
            <Link href="/other">
              <Button variant="contained" color="success">
                Link to another page
              </Button>
            </Link>

            {/* Here is a counter that shows how to interact with global state */}
            <Stack direction="row" gap={2} alignItems="center">
              <Button
                variant="contained"
                color="secondary"
                onClick={decrementCounter}
              >
                -1
              </Button>
              <Typography variant="body1" color="text.secondary">
                Global State: {count}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={incrementCounter}
              >
                +1
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </main>
    </>
  );
}
