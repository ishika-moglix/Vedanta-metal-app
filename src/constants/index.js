export const TOKEN_RESP = {
  successful: true,
  message: null,
  status: '200',
  errors: null,
  warnings: null,
  data: {
    userId: '278',
    branchId: '1',
    companyId: '1',
    application: 1,
    token: '90135903-5988-4826-9c3a-23c458d352c4',
  },
};

export const phoneValidator = phone => {
  return /^[6-9][0-9]{9}$/.test(phone);
};

export const phoneLengthChecker = phone => {
  return phone && phone.length == 10;
};

export const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,20}))$/i;

export const passwordExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[<>?{}[\]()|\\/,.~`$@$!%*?&#_^])[A-Za-z\d<>?{}[\]()|\\/,.~`$@$!%*?&#_^]{8,}$/;

export const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  // '^([0][1-9]|[1-2][0-9]|[3][0-7])([A-Z]{5})([0-9]{4})([A-Z]{1}[1-9A-Z]{1})([Z]{1})([0-9A-Z]{1})+$';
  
export const accountNOExp = /^[0-9]\d*$/;
export const bankNameExp = /^(?![\s-])[a-zA-Z\s-]+$/;
export const branchAddressExp = /^(?![\s-])[a-zA-Z0-9\s-]+$/;
export const ifscExp = /[A-Z|a-z]{4}[0][a-zA-Z0-9]{6}$/;
export const ifscExp2 = /^[A-Za-z]{4}\d{7}$/;
export const nameRegex = /^[A-Za-z ]+$/;
export const tanRegex = /^[A-Z]{4}[0-9]{5}[A-Z]$/;
export const annualRegex = /^[0-9]+$/;
export const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
export const filterTextRegex = /[^a-zA-Z0-9.,-]/g;
export const alphaNumericRegex = /^[A-Za-z0-9 ]+$/;
export const AlLiveTrackingLink =
  'https://yatayaat.in/newtracking/reports/vedanta_fg_view.php?token=57310&userid=85086&extra=0&invoice=';

export const LIVE_TRACKING_LINK_COPPER =
  'https://qa1.noviretechnologies.com/IVTS/services.do?method=showSterliteTripDataServices&username=serviceuser&password=7C53C003126C10E1091C73F4F945FEB4&companyid=999&invoiceid=';

