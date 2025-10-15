import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

type ObjectTrackingProps = {
  summary: string;
};

const trackingData = [
  { id: 'P001', entryTime: '10:31 AM', location: 'Zone A', status: 'Normal' },
  { id: 'P002', entryTime: '10:32 AM', location: 'Zone B', status: 'Normal' },
  { id: 'P003', entryTime: '10:33 AM', location: 'Zone A', status: 'Flagged' },
  { id: 'P004', entryTime: '10:34 AM', location: 'Zone C', status: 'Normal' },
];

export function ObjectTracking({ summary }: ObjectTrackingProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Behavioral Analysis</CardTitle>
        <CardDescription>{summary}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Object ID</TableHead>
              <TableHead>Entry Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trackingData.map(item => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.entryTime}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>
                  <Badge
                    variant={item.status === 'Flagged' ? 'destructive' : 'secondary'}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
