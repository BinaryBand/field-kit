import styled, { StyledComponent } from "@emotion/styled";

const Stack: StyledComponent<StackProps> = styled.div((props: StackProps) => `
  display: flex;
  flex-direction: ${props.direction ?? "column"};
  flex-wrap: ${props.wrap ? "wrap" : "nowrap"};
  justify-content: ${props.justify ?? "start"};
  align-items: ${props.align ?? "start"};
  gap: ${props.gap ?? 0}em;
`);

export default Stack;
