import { useState, useEffect } from "react";

import styles from "./App.css";
import {
    MantineProvider,
    Select,
    MultiSelect,
    Text,
    Container,
    Group,
    Flex,
    Stack,
    Center,
    Paper,
    SimpleGrid,
    Dialog
} from "@mantine/core";
import "@mantine/core/styles.css";
import Papa from "papaparse";

import findMidpoint from "./functions/findMidpoint";
import minimiseSum from "./functions/minimiseSum";
import minimiseSumAndVariance from "./functions/minimiseSumAndVariance";
import findTravelTimes from "./functions/findTravelTimes";

import MidpointDisplay from "./components/MidpointDisplay";
import TravelTimesDisplay from "./components/TravelTimesDisplay";
import { TooltipQuestion } from "./components/TooltipQuestion";

function App() {
    const [times, setTimes] = useState({});
    const [stations, setStations] = useState([]);
    const [selectedStations, setSelectedStations] = useState([]);
    const [customDestination, setCustomDestination] = useState("");

    const regex_thing = /MRT STATION \([^\)]*\)/g;

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
                const csv = Papa.parse(responseText, { header: false, skipEmptyLines: true});
                
                
                const newStations = csv["data"].map((e) => {
                    // Should use .reduce here.
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

    const midpointCode = findMidpoint(times, selectedStations, minimiseSum);
    const midpointStation = stations.find(
        (elem) => elem.value === midpointCode
    );
    const midpointName = midpointStation
        ? midpointStation.label.replace(regex_thing, "")
        : null;
    const travelTimes =
        selectedStations.length >= 2
            ? findTravelTimes(times, selectedStations, midpointCode)
            : [];

    const midpointWithVarianceCode = findMidpoint(
        times,
        selectedStations,
        minimiseSumAndVariance
    );
    const midpointWithVarianceStation = stations.find(
        (elem) => elem.value === midpointWithVarianceCode
    );
    const midpointWithVarianceName = midpointWithVarianceStation
        ? midpointWithVarianceStation.label.replace(regex_thing, "")
        : null;
    const travelTimesWithVariance =
        selectedStations.length >= 2
            ? findTravelTimes(times, selectedStations, midpointWithVarianceCode)
            : [];

    const travelTimesCustom = customDestination
        ? findTravelTimes(times, selectedStations, customDestination)
        : [];

    const selectedStationsNames = selectedStations.map((selectedStation) => {
        const station = stations.find((elem) => elem.value === selectedStation);
        return station.label.replace(regex_thing, "");
    });
    
    //<Flex align="center" justify="center" mt={"100px"} gap={"14%"}>
    return (
        <MantineProvider>
            <Container>
                <header>{}</header>
                <Container>
                    <Text size="xl">
                        {"Find the best MRT station to meet."}
                    </Text>
                </Container>

                <MultiSelect
                    label="Choose starting points"
                    placeholder="Select Stations"
                    data={stations}
                    onChange={setSelectedStations}
                    maxDropdownHeight={200}
                    searchable
                    comboboxProps={{ transitionProps: { transition: 'pop', duration: 250 } }}
                    mt={"md"}
                />
            </Container>

            <SimpleGrid
                cols={2}
                mt={"40px"}
                spacing={"5%"}
                verticalSpacing={"sm"}
            >
                <Paper shadow="xs" radius="md" withBorder p="lg">
                    <Stack>
                        <MidpointDisplay
                            label={"Best Option"}
                            tooltipDisplay={"Minimise total travel time"}
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
                            tooltipDisplay={"Penalises large variance in travel time."}
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

            <Paper shadow="xs" radius="md" withBorder p="lg" mt={"xl"}>
                <Text size="md" fw={500}>
                    {"Custom Destination"}
                </Text>
                <Flex justify={"center"}>
                <Select
                    placeholder="Select Station"
                    data={stations.filter(elem => (!(selectedStations.includes(elem.value))))}
                    disabled={selectedStations.length <= 0}
                    onChange={setCustomDestination}
                    maxDropdownHeight={200}
                    searchable
                    clearable
                    comboboxProps={{ transitionProps: { transition: 'pop', duration: 250 } }}
                    mt={"xs"}
                />

                </Flex>
                {travelTimesCustom ? (
                    <TravelTimesDisplay
                        stationNames={selectedStationsNames}
                        travelTimes={travelTimesCustom}
                    />
                ) : null}
            </Paper>
            
        </MantineProvider>
    );
}

export default App;
