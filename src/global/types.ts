export interface SchemaField {
  id: string;
  title: string;
  validationRegex: string;
}

export interface Schema {
  id: string;
  title: string;
  fields: Array<SchemaField>;
}
