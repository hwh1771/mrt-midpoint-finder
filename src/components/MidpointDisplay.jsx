import { Stack, Text, Flex } from "@mantine/core";
import { TooltipQuestion } from "./TooltipQuestion";

export default function MidpointDisplay({
    label,
    tooltipDisplay,
    stationName,
    stationCode,
}) {
    return (
        <Stack gap={0} mb={"xl"}>
            <Flex justify={"center"} align={"center"} gap={"4px"}>
                <Text size="md" fw={500}>
                    {label}
                </Text>
                <TooltipQuestion label={tooltipDisplay} />
            </Flex>

            {stationName ? (
                <Text size="26px" fw={700} mt={8}>
                    {stationName}
                </Text>
            ) : null}

            <Text size="20px" fw={700} mt={4}>
                {"(" + stationCode + ")"}
            </Text>
        </Stack>
    );
}
