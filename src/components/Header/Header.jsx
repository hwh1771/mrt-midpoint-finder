import { ColorSchemeToggle } from "../ColorSchemeToggle";
import { GithubLink } from "../GithubLink";
import { Flex, Group, Paper, Text } from "@mantine/core";

import "./Header.css";

export default function Header({ title = "MRT Midpoint Finder" }) {
    return (
        <Paper withBorder className="header">
            <Flex justify={"space-between"} w className="header-inner">
                <Group>
                    <Text size={"lg"} fw={700}>{title}</Text>
                </Group>

                <Group>
                    <ColorSchemeToggle />
                    <GithubLink />
                </Group>
            </Flex>
        </Paper>
    );
}
