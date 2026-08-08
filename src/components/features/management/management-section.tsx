/*
 * @Author: galhkoernia 
 * @Date: 2026-08-08 07:49:26 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-08 08:19:49
 */

import { Container, PersonCard, Section } from "@/components/ui/index";
import { managementMembers } from "./data";

export function ManagementSection() {
    return (
        <Section tone="muted">
            <Container>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {managementMembers.map((member) => (
                        <PersonCard
                            key={member.id}
                            name={member.name}
                            subtitle={member.description}
                            tag={member.role}
                        />
                    ))}
                </div>
            </Container>
        </Section>
    );
}