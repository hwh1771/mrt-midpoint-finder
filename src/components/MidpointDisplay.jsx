import { Stack, Text, Flex } from "@mantine/core";
import { TooltipQuestion } from "./TooltipQuestion";
import '../style/MidpointDisplay.css'


export default function MidpointDisplay({
    label,
    tooltipDisplay = null,
    stationName,
    stationCode,
}) {
    return (
        <Stack gap={0} mb={"lg"}>
            <Flex justify={"center"} align={"center"} gap={"4px"}>
                <Text size="md" fw={500}>
                    {label}
                </Text>
                {tooltipDisplay ? (
                    <TooltipQuestion label={tooltipDisplay} />
                ) : null}
            </Flex>

            {stationName ? (
                <Text className="station-name" mt={8}>
                    {stationName}
                </Text>
            ) : null}

            <Text className="station-code" mt={0}>
                {"(" + stationCode + ")"}
            </Text>
        </Stack>
    );
}
