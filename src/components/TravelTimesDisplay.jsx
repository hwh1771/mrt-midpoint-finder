import { Flex, Stack, Text, Grid } from "@mantine/core";

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}

export default function TravelTimesDisplay({ stationNames, travelTimes }) {

    return (
        <Stack>
            {stationNames.map((elem, i) => (
                <Flex key={i} justify={"space-between"} gap={"6"} px={"10%"}>
                    <Text>{"From " + toTitleCase(elem) + ":"}</Text>

                    <Text>
                        {travelTimes[i] != null
                            ? Math.round(travelTimes[i] / 60).toString() +
                              " mins"
                            : "No data"}
                    </Text>
                </Flex>
            ))}
        </Stack>
    );
}
