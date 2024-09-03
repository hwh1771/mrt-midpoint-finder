import { useState, useEffect, useContext } from "react";
import "./App.css";

import {
    MantineProvider,
    Select,
    MultiSelect,
    Text,
    Container,
    Stack,
    Paper,
    SimpleGrid,
} from "@mantine/core";
import "@mantine/core/styles.css";

import Papa from "papaparse";

import findMidpoint from "./functions/findMidpoint";
import minimiseSum from "./functions/minimiseSum";
import minimiseSumAndVariance from "./functions/minimiseSumAndVariance";
import findTravelTimes from "./functions/findTravelTimes";

import MidpointDisplay from "./components/MidpointDisplay/MidpointDisplay";
import TravelTimesDisplay from "./components/TravelTimesDisplay";
import Header from "./components/Header/Header";

function App() {
    const [colorScheme, setColorScheme] = useState("light");
    //const { setColorScheme, clearColorScheme } = useMantineColorScheme();

    const [times, setTimes] = useState({});
    const [stations, setStations] = useState([]);
    const [selectedStations, setSelectedStations] = useState([]);
    const [customDestination, setCustomDestination] = useState("");

    const regex_thing = / MRT STATION \([^)]*\)/g;

    // Read MRT times data from JSON. data[src][target] is the time to travel from src to target.
    useEffect(() => {
        fetch("/mrt_times.json")
            .then((response) => response.json())
            .then((data) => {
                setTimes(data);
            })
            .catch((error) => {
                console.error("Error loading MRT Times:", error);
            });
    }, []);

    // Read MRT master data. This is to get the station name and code.
    useEffect(() => {
        fetch("/mrt.csv")
            .then((response) => response.text())
            .then((responseText) => {
                const csv = Papa.parse(responseText, {
                    header: false,
                    skipEmptyLines: true,
                });
                const newStations = csv["data"].map((e) => {
                    const text =
                        e[2].replace(regex_thing, "") + " (" + e[3] + ")"; // Format the label seen in the select.
                    const newStation = {
                        label: text,
                        value: e[3],
                    };
                    return newStation;
                });

                setStations(newStations);
            })
            .catch((error) => {
                console.error("Error loading CSV:", error);
            });
    }, []);

    // Find Midpoint for objective function sum.
    const midpointCode = findMidpoint(times, selectedStations, minimiseSum);
    const midpointStation = stations.find(
        (elem) => elem.value === midpointCode
    );
    const midpointName = midpointStation
        ? midpointStation.label.replace(regex_thing, "")
        : null;
    const travelTimes =selectedStations.length >= 2
        ? findTravelTimes(times, selectedStations, midpointCode)
        : [];

    // Find Midpoint for objective function sum + variance.
    const midpointWithVarianceCode = findMidpoint(times,selectedStations,minimiseSumAndVariance);
    const midpointWithVarianceStation = stations.find(
        (elem) => elem.value === midpointWithVarianceCode
    );
    const midpointWithVarianceName = midpointWithVarianceStation
        ? midpointWithVarianceStation.label.replace(regex_thing, "")
        : null;
    const travelTimesWithVariance = selectedStations.length >= 2
        ? findTravelTimes(times, selectedStations, midpointWithVarianceCode)
        : [];

    // Find Travel Times for custom midpoint.
    const travelTimesCustom = customDestination
        ? findTravelTimes(times, selectedStations, customDestination)
        : [];

    const selectedStationsNames = selectedStations.map((selectedStation) => {
        const station = stations.find((elem) => elem.value === selectedStation);
        return station.label.replace(regex_thing, "");
    });

    return (
        <MantineProvider
            theme={{ colorScheme: colorScheme }}
            withCssVariables
            withGlobalStyles
        >
            <Header/>
            <Container class="main-content">
                <Container px={"xs"}>
                    <Container mt={"28px"} mb={"34px"}>
                        <Text size="26px" fw={700}>
                            {
                                "Find the middle MRT station from a list of stations."
                            }
                        </Text>
                    </Container>

                    <Container>
                        <Text size="16px" fw={500}>
                            {"Choose starting points"}
                        </Text>
                    </Container>

                    <MultiSelect
                        placeholder="Select Stations"
                        data={stations}
                        onChange={setSelectedStations}
                        maxDropdownHeight={200}
                        searchable
                        comboboxProps={{
                            transitionProps: {
                                transition: "pop",
                                duration: 250,
                            },
                        }}
                        mt={"xs"}
                    />
                </Container>

                <SimpleGrid
                    cols={{ base: 1, xs: 2 }}
                    mt={"40px"}
                    spacing={"5%"}
                    verticalSpacing={"lg"}
                >
                    <Paper shadow="xs" radius="md" withBorder p="lg">
                        <Stack>
                            <MidpointDisplay
                                label={"Best Option"}
                                tooltipDisplay={"Minimises total travel time."}
                                stationName={midpointName}
                                stationCode={midpointCode}
                            />
                            {selectedStations.length > 1 ? (
                                <TravelTimesDisplay
                                    stationNames={selectedStationsNames}
                                    travelTimes={travelTimes}
                                />
                            ) : null}
                        </Stack>
                    </Paper>

                    <Paper shadow="xs" radius="md" withBorder p="lg">
                        <Stack>
                            <MidpointDisplay
                                label={"Fairer Option"}
                                tooltipDisplay={
                                    "Penalises large variance in travel time."
                                }
                                stationName={midpointWithVarianceName}
                                stationCode={midpointWithVarianceCode}
                            />
                            {selectedStations.length > 1 ? (
                                <TravelTimesDisplay
                                    stationNames={selectedStationsNames}
                                    travelTimes={travelTimesWithVariance}
                                />
                            ) : null}
                        </Stack>
                    </Paper>
                </SimpleGrid>

                <Paper shadow="xs" radius="md" withBorder p="lg" mt={"lg"}>
                    <Text size="md" fw={500}>
                        {"Custom Destination"}
                    </Text>
                    <Container>
                        <Select
                            placeholder="Select Station"
                            data={stations.filter(
                                (elem) => !selectedStations.includes(elem.value)
                            )}
                            disabled={selectedStations.length <= 0}
                            onChange={setCustomDestination}
                            maxDropdownHeight={200}
                            searchable
                            clearable
                            comboboxProps={{
                                transitionProps: {
                                    transition: "pop",
                                    duration: 250,
                                },
                            }}
                            mt={"xs"}
                        />
                    </Container>
                    {travelTimesCustom ? (
                        <TravelTimesDisplay
                            stationNames={selectedStationsNames}
                            travelTimes={travelTimesCustom}
                        />
                    ) : null}
                </Paper>
            </Container>
        </MantineProvider>
    );
}

export default App;
