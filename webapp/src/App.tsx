import { TrpcProvider } from "./lib/trpc"
import { AllIdeasPage } from "./pages/AllIdeasPage/AllIdeasPage"

export const App = () => {
  return (
    <TrpcProvider>
      <AllIdeasPage />
    </TrpcProvider>
  )
}