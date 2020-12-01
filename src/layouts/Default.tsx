import React, { PropsWithChildren } from "react"

interface Props {
  from: string
}

export const DefaultLayout: React.FC<PropsWithChildren<Props>> = ({
  children,
}) => {
  return <div>{children}</div>
}
