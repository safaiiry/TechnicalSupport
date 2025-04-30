import ApmRequest from '../../assets/APMRequest.svg?react'
import ComputerRepair from '../../assets/ComputerRepair.svg?react'
import ConferenceRequest from '../../assets/ConferenceRequest.svg?react'
import InternetRequest from '../../assets/InternetRequest.svg?react'
import MailRequest from '../../assets/MailRequest.svg?react'
import OrgPlus from '../../assets/OrgPlus.svg?react'
import OrgRepair from '../../assets/OrgRepair.svg?react'
import PhoneRequest from '../../assets/PhoneRequest.svg?react'
import SoftwareRequest from '../../assets/SoftwareRequest.svg?react'

export const categoryIcons: Record<string, React.FunctionComponent<React.SVGProps<SVGSVGElement>>> = {
  '0b62593c-736f-42c5-8716-52762df59fb6': SoftwareRequest,
  '3c893752-e90a-4d77-bd01-fbca76914b76': MailRequest,
  '4970c1a4-e11b-463e-b029-22379b65d4d3': PhoneRequest,
  '7ce238f8-694f-4a38-9500-bbeaeb9ec3c7': ApmRequest,
  '9c7e23c7-3c73-4a29-bd77-388d877cbfee': OrgRepair,
  'a9757930-f749-4ac7-a293-672c47a4ef3c': ComputerRepair,
  'a980086c-1ee2-4e28-b40e-7983941aff74': InternetRequest,
  'c99d5b84-b9f5-4cca-9efd-c187ddc69211': ConferenceRequest,
  '52266ee0-fce6-4918-a70c-9b8bf63981ff': OrgPlus,
}
