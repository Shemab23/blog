import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

type Props = {
  heads: string[];
  data: Record<string, React.ReactNode>[];
};
export const TableMinimal = ({ heads, data }: Props) => {
  return (
    <div className="my-6 w-full rounded-lg border border-border overflow-hidden">
      {/* table-fixed forces columns to fit within 100% width instead of expanding */}
      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {heads.map((head, index) => (
              <TableHead
                key={index}
                className="h-auto py-2.5 px-2.5 sm:px-4 font-bold text-foreground whitespace-normal break-words align-top text-xs sm:text-sm"
              >
                {head}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => {
            // Extracts values in order so any object keys work automatically
            const cells = Object.values(row);

            return (
              <TableRow key={rowIndex} className="last:border-b-0">
                {cells.map((cell, cellIndex) => (
                  <TableCell
                    key={cellIndex}
                    className={`py-2.5 px-2.5 sm:px-4 whitespace-normal break-words align-top text-xs sm:text-sm ${
                      cellIndex === 0
                        ? "font-bold text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
