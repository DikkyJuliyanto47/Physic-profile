/*
 * @Author: galhkoernia 
 * @Date: 2026-08-08 07:49:26 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-13 16:00:00
 */

import { PersonCard } from "@/components/ui/index";
import { managementMembers } from "./data";

export function ManagementSection() {
    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {managementMembers.map((member) => (
                <PersonCard
                    key={member.id}
                    name={member.name}
                    subtitle={member.description}
                    tag={member.role}
                />
            ))}
        </div>
    );
}