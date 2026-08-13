/*
 * @Author: galhkoernia 
 * @Date: 2026-08-08 07:45:52 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-08 08:22:00
 */

export interface ManagementMember {
    id: string;
    name: string;
    role: string;
    description: string;
}

export const managementMembers: ManagementMember[] = [
    {
        id: "management-1",
        name: "Lorem Ipsum",
        role: "Ketua",
        description: "Dolor sit amet, consectur adipiscing",
    },
    {
        id: "management-2",
        name: "Lorem Ipsum",
        role: "Sekretaris",
        description: "Dolor sit amet, consectur adipiscing",
    },
    {
        id: "management-3",
        name: "Lorem Ipsum",
        role: "Bendahara",
        description: "Dolor sit amet, consectur adipiscing",
    },
    {
        id: "management-4",
        name: "Lorem Ipsum",
        role: "Koordinator Bidang 1",
        description: "Dolor sit amet, consectur adipiscing",
    }
]