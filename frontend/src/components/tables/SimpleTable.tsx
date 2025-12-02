import { Table, THead, TBody, TR, TH, TD } from "../ui/table";

type Props = { headers: string[]; rows: Array<Array<string | number>> };

export default function SimpleTable({ headers, rows }: Props) {
  return (
    <Table>
      <THead>
        <TR>{headers.map((h) => <TH key={h}>{h}</TH>)}</TR>
      </THead>
      <TBody>
        {rows.map((row, idx) => (
          <TR key={idx}>
            {row.map((cell, i) => (
              <TD key={i}>{cell}</TD>
            ))}
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
