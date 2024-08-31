import { Stack, Text, Flex } from "@mantine/core";
import { TooltipQuestion } from "../TooltipQuestion";
import "./MidpointDisplay.css";

export default function MidpointDisplay({
    label,
    tooltipDisplay = null,
    stationName,
    stationCode,
}) {

    const lineCode = stationCode.slice(0, 2)

    const colorMapping = {
        NS: 'red',
        EW: 'green',
        CC: 'yellow',
        NE: 'purple',
        DT: 'blue',
        TE: '#965827'
    }

    const color = lineCode in colorMapping ? colorMapping[lineCode] : 'black'

    
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
                <Text className="station-name" mt={8} c={color}>
                    {stationName}
                </Text>
            ) : null}

            <Text className="station-code" mt={0} c={color}>
                {"(" + stationCode + ")"}
            </Text>
        </Stack>
    );
}
