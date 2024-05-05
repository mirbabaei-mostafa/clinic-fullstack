import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsCheckLg, BsEnvelope, BsLock } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const Login = () => {
  const [accountType, setAccountType] = useState<string>('User');
  const [fieldSelect, setFieldSelect] = useState<string>('');
  const [loginShow, setLoginShow] = useState<boolean>(false);
  const { t } = useTranslation();
  return (
    <div className="flex flex-col m-auto w-[90vw] md:w-[34vw] bg-white rounded-md p-4 md:p-7 items-center justify-between">
      <div className="pb-4">
        <h1>{t('ChooseAccountType')}</h1>
      </div>
      <div className="flex flex-row gap-1 justify-between items-center">
        <div
          className={
            accountType === 'Patient'
              ? 'cursor-pointer relative'
              : 'cursor-pointer'
          }
          onClick={() => setAccountType('Patient')}
        >
          <img
            src="images/Patient-login.jpg"
            className={
              accountType === 'Patient'
                ? 'accountimg-select rounded-l-md'
                : 'accountimg rounded-l-md'
            }
          />
          {accountType === 'Patient' && (
            <div className="absolute bottom-2 left-2 bg-myblue-light rounded-full w-8 h-8 flex items-center">
              <BsCheckLg size={28} color={import.meta.env.ICON_COLOR} />
            </div>
          )}
        </div>
        <div
          className={
            accountType === 'Doctor'
              ? 'cursor-pointer relative'
              : 'cursor-pointer'
          }
          onClick={() => setAccountType('Doctor')}
        >
          <img
            src="images/Doctor-login.jpg"
            className={
              accountType === 'Doctor' ? 'accountimg-select' : 'accountimg'
            }
          />
          {accountType === 'Doctor' && (
            <div className="absolute bottom-2 left-0 right-0 m-auto bg-myblue-light rounded-full w-8 h-8 flex items-center">
              <BsCheckLg size={28} color={import.meta.env.ICON_COLOR} />
            </div>
          )}
        </div>
        <div
          className={
            accountType === 'User'
              ? 'cursor-pointer relative'
              : 'cursor-pointer'
          }
          onClick={() => setAccountType('User')}
        >
          <img
            src="images/User-login.jpg"
            className={
              accountType === 'User'
                ? 'accountimg-select rounded-r-md'
                : 'accountimg rounded-r-md'
            }
          />
          {accountType === 'User' && (
            <div className="absolute bottom-2 right-2 bg-myblue-light rounded-full w-8 h-8 flex items-center">
              <BsCheckLg size={28} color={import.meta.env.ICON_COLOR} />
            </div>
          )}
        </div>
      </div>
      <div className="py-5 text-mygray-dark text-[16px] font-info flex flex-col items-center">
        <h2>{t('Hello') + ' ' + t(accountType)}</h2>
        <h3 className="text-[14px]">{t('FillOutForm')}</h3>
      </div>
      <div className="w-full">
        <form>
          <div className="flex flex-col items-center justify-between gap-7 w-full">
            <div
              className={
                'flex flex-row gap-5 relative justify-between items-center border-2 rounded-md px-4 py-6 w-full' +
                (fieldSelect === 'Email'
                  ? ' border-myblue-light'
                  : ' border-mygray')
              }
            >
              <div className="">
                <BsEnvelope size={26} />
              </div>
              <input
                type="text"
                placeholder={t('Email')}
                onFocus={() => setFieldSelect('Email')}
                onBlur={() => setFieldSelect('')}
                className="border-0 font-text font-normal text-[16px] hide-outline bg-white w-full"
              />

              <div
                className={
                  'absolute -top-3 left-4 rounded-md px-2 py-[2px] font-special font-bold text-[13px] text-white' +
                  (fieldSelect === 'Email' ? ' bg-myblue-light' : ' bg-mygray')
                }
              >
                {t('Email')}
              </div>
            </div>
            <div
              className={
                'flex flex-row gap-5 relative justify-between items-center border-2 rounded-md px-4 py-6 w-full' +
                (fieldSelect === 'Password'
                  ? ' border-myblue-light'
                  : ' border-mygray')
              }
            >
              <div className="">
                <BsLock size={26} />
              </div>
              <input
                type="text"
                placeholder={t('Password')}
                onFocus={() => setFieldSelect('Password')}
                onBlur={() => setFieldSelect('')}
                className="border-0 font-text font-normal text-[16px] hide-outline bg-white w-full"
              />
              <div className=" border-l-2 border-mygray pl-2">
                <Link
                  to={'/forgot'}
                  className="text-myblue-light text-[16px] hover:text-myblue"
                >
                  {t('Forgot')}
                </Link>
              </div>
              <div
                className={
                  'absolute -top-3 left-4 rounded-md px-2 py-[2px] font-special font-bold text-[13px] text-white' +
                  (fieldSelect === 'Password'
                    ? ' bg-myblue-light'
                    : ' bg-mygray')
                }
              >
                {t('Password')}
              </div>
            </div>
            <div className="flex flex-row gap-6 justify-between items-center w-full">
              <div className="font-text font-normal text-[16px]">
                {t('NoAccount') + ' '}
                <Link
                  to="/signup"
                  className="font-text font-normal text-[16px]"
                >
                  {t('Signup')}
                </Link>
              </div>
              <div className="">
                <button className="font-special font-bold text-[16px] rounded-md px-4 py-2 text-white bg-myblue-light">
                  {t('Login')}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
