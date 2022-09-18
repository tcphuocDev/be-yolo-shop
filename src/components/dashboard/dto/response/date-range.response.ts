import { Expose, Type } from 'class-transformer';

export class RangeDate {
  @Expose()
  tag: string;

  @Expose()
  startDate: string;

  @Expose()
  endDate: string;

  constructor(tag: string, startDate: string, endDate: string) {
    this.tag = tag;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
export class CountReport {
  @Expose()
  count: number;

  @Expose()
  status: number;
}

export class ReportStockByDay {
  @Expose()
  tag: string;

  @Expose()
  rangeDate: string;

  @Expose()
  @Type(() => CountReport)
  countReport: CountReport[];

  constructor(tag: string, countReport: CountReport[], rangeDate: string) {
    this.tag = tag;
    this.countReport = countReport;
    this.rangeDate = rangeDate;
  }
}
