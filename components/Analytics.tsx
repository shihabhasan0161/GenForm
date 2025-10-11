import React from "react";
import {
  Card,
  CardContent, 
  CardHeader,
  CardTitle,
} from "./ui/card"; 
import { Eye } from "lucide-react";
import {
  SidebarFooter,
} from "./ui/sidebar";
import UpgradeButton from "./UpgradeButton";
import { currentUser } from "@clerk/nextjs/server";

type Props = {
  noOfSubmissions:number;
}

const Analytics : React.FC<Props> = async ({noOfSubmissions}) => {
  const user = await currentUser();

  return (
    <div>
      <Card className="w-[350px] shadow-md shadow-yellow-600">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-bold">Total Submissions</CardTitle>
          <Eye />
        </CardHeader>
        <CardContent>
          <div>{noOfSubmissions}</div>
          <p>Total submissions to your forms.</p>
        </CardContent>
      </Card>
      <SidebarFooter>
        <UpgradeButton userId={user?.id}/>
      </SidebarFooter>
    </div>
  );
};

export default Analytics;