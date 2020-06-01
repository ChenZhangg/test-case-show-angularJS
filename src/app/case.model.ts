export class Case {
  id: number;
  repoName: string;
  jobNumber: string;
  description: string
  includeException: boolean;
  includeAssertion: boolean;
  num: number;
  causeUrl: string;
  preCommit: string;
  currentCommit: string;
  multipleCrash: boolean;
  crashClusterNum: number;
  figs: string[];
  diffUrl: string;
  logURL: string;
  testItemsURL: string;
  changedFilesURL: string;
  log: string

  constructor(obj?: any) {
    this.id              = obj && obj.id             || null;
    this.repoName              = obj && obj.repoName             || null;
    this.jobNumber           = obj && obj.jobNumber          || null;
    this.description           = obj && obj.description          || null;
    this.includeException           = obj && obj.includeException          || null;
    this.includeAssertion           = obj && obj.includeAssertion          || null;
    this.num           = obj && obj.num          || null;
    this.causeUrl              = obj && obj.causeUrl             || null;
    this.preCommit              = obj && obj.preCommit             || null;
    this.currentCommit              = obj && obj.currentCommit             || null;
    this.multipleCrash              = obj && obj.multipleCrash             || null;
    this.crashClusterNum              = obj && obj.crashClusterNum             || null;
    this.figs              = obj && obj.figs             || null;

    this.diffUrl = `https://github.com/${this.repoName}/compare/${this.preCommit}...${this.currentCommit}`;
    this.logURL = obj && obj.logURL             || null;
    this.testItemsURL = obj && obj.testItemsURL             || null;
    this.changedFilesURL= obj && obj.changedFilesURL             || null;
  }
}

export class TestItem {
  className: string;
  methodName: string;
  errorMessage: string;
  stackTrace: string

  constructor(obj?: any) {
    this.className              = obj && obj.className             || null;
    this.methodName              = obj && obj.methodName             || null;
    this.errorMessage           = obj && obj.errorMessage          || null;
    this.stackTrace           = obj && obj.stackTrace          || null;
  }
}

export class ChangedMethod {
  className: string;
  methodName: string;
  startLineNumber: number;
  endLineNumber: number

  constructor(obj?: any) {
    this.className              = obj && obj.className             || null;
    this.methodName              = obj && obj.methodName             || null;
    this.startLineNumber           = obj && obj.startLineNumber          || null;
    this.endLineNumber           = obj && obj.endLineNumber          || null;
  }
}

export class ChangedFile {
  status: string;
  preFilePath: string;
  currentFilePath: string;
  changedMethodsURL: string
  changedMethods: ChangedMethod[]

  constructor(obj?: any) {
    this.status              = obj && obj.status             || null;
    this.preFilePath              = obj && obj.preFilePath             || null;
    this.currentFilePath           = obj && obj.currentFilePath          || null;
    this.changedMethodsURL           = obj && obj.changedMethodsURL          || null;
    this.changedMethods = new Array<ChangedMethod>();
  }
}