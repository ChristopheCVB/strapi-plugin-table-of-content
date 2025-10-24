import { unstable_useDocumentLayout as useDocumentLayout } from '@strapi/strapi/admin'

const getEditLayoutItemLabel = (edit: ReturnType<typeof useDocumentLayout>['edit'], fieldName: string) => {
  // flat(2) is used to flatten the layout array to 2 levels deep (array of rows, each row is an array of items)
  return edit.layout.flat(2).find((item) => item.name === fieldName)?.label
}

export { getEditLayoutItemLabel }
