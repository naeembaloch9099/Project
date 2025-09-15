export default function Heading({ as = "h1", children }) {
  const Tag = as;
  return <Tag>{children}</Tag>;
}
