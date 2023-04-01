import React, {useRef, useState, useEffect, useId} from 'react'
import dayjs from 'dayjs'
import {
  updateEmail,
  updateProfile,
  updatePassword,
  sendEmailVerification,
  User as FirebaseUser
} from 'firebase/auth'
import {IconButton} from '@mui/material'
import {
  EditRounded as EditRoundedIcon,
  SaveRounded as SaveRoundedIcon,
  BlockRounded as BlockRoundedIcon
} from '@mui/icons-material'

import Tooltip from '../../components/Tooltip'
import * as colors from '@mui/material/colors'

import UIButton from '../../components/Button'
import FullscreenModal from '../../components/FullscreenModal'
import TextField from '../../components/TextField'
import ConfirmUserDeletionModal from '../ConfirmUserDeletionModal'
import VerifyAuthModal from '../VerifyAuthModal'
import {TextForm} from '../../interfaces'
import {ButtonsWrapper, FieldName, FieldValue} from '../styles'
import {useModalsContext} from '../../contexts/modals/useModalsContext'
import {useAuthContext} from '../../contexts/auth/useAuthContext'
import {useVerifyUser} from '../../hooks/useVerifyUser'
import {useSnackbar} from '../../contexts/snackbar/useSnackbar'
import {MODAL_NAME} from '../../contexts/modals/constants'
import {INIT_PASSWORD_FORM_STATE} from './constants'
import {MIN_PASS_LENGTH} from '../../pages/SignupPage/constants'
import * as UI from './styles'

// TODO: split huge component
const UserProfileModal = () => {
  const verifyUser = useVerifyUser()
  const {enqueueSnackbar, closeSnackbar} = useSnackbar()
  const {currentUser} = useAuthContext()
  const {openedModal, setOpenedModal} = useModalsContext()

  const userDataFormId = useId()
  const passwordFormId = useId()

  const timeoutId = useRef<null | ReturnType<typeof setTimeout>>(null)

  const [isEditMode, setIsEditMode] = useState(false)
  const [isChangePasswordMode, setIsChangePasswordMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSendVerificationEmailLoading, setIsSendVerificationEmailLoading] =
    useState(false)
  const [isSendVerificationFailed, setIsSendVerificationFailed] =
    useState(false)
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false)
  const [
    isDeleteUserConfirmationModalOpen,
    setIsDeleteUserConfirmationModalOpen
  ] = useState(false)
  const [isVerifyAuthModalOpen, setIsVerifyAuthModalOpen] = useState(false)
  const [form, setForm] = useState<TextForm>({
    email: currentUser?.email || '',
    displayName: currentUser?.displayName || ''
  })
  const [passwordForm, setPasswordForm] = useState<TextForm>(
    INIT_PASSWORD_FORM_STATE
  )

  const isOpen = openedModal === MODAL_NAME.USER_PROFILE
  const isEmailChanged = form.email.trim() !== currentUser?.email
  const isNameChanged =
    (Boolean(form.displayName.trim()) || Boolean(currentUser?.displayName)) &&
    form.displayName.trim() !== currentUser?.displayName

  const isSaveButtonDisabled = isChangePasswordMode
    ? Object.values(passwordForm).some(
        (value) => value.length < MIN_PASS_LENGTH
      )
    : !form.email.trim() || (!isEmailChanged && !isNameChanged)

  const resetForm = () => {
    setForm({
      email: currentUser?.email || '',
      displayName: currentUser?.displayName || ''
    })
  }

  const resetPasswordForm = () => {
    setPasswordForm(INIT_PASSWORD_FORM_STATE)
  }

  useEffect(() => {
    if (!isOpen) {
      setIsEditMode(false)
      setIsVerificationEmailSent(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isEditMode) {
      setIsChangePasswordMode(false)
      resetForm()
      resetPasswordForm()
    }
  }, [isEditMode])

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }
    }
  }, [])

  const handleClose = () => {
    closeSnackbar()
    setOpenedModal(null)
  }

  const handleChangePassword = async () => {
    setIsLoading(true)

    if (passwordForm.newPassword !== passwordForm.repeatNewPassword) {
      setIsLoading(false)
      setPasswordForm((prev) => ({
        ...prev,
        newPassword: '',
        repeatNewPassword: ''
      }))
      enqueueSnackbar('Пароли не совпадают', {
        variant: 'error',
        onlyBottom: true
      })
      return
    }

    if (passwordForm.newPassword !== passwordForm.newPassword.trim()) {
      setIsLoading(false)
      setPasswordForm((prev) => ({
        ...prev,
        newPassword: '',
        repeatNewPassword: ''
      }))
      enqueueSnackbar('Не используйте пробел в началу и конце пароля', {
        variant: 'warning',
        onlyBottom: true
      })
      return
    }

    const isVerified = await verifyUser(passwordForm.password)

    if (!isVerified) {
      setIsLoading(false)
      resetPasswordForm()
      enqueueSnackbar('Неверный пароль или нет соединения с сервером', {
        variant: 'error',
        onlyBottom: true
      })
      return
    }

    try {
      await updatePassword(
        currentUser as FirebaseUser,
        passwordForm.newPassword
      )
      enqueueSnackbar('Пароль успешно изменен', {
        variant: 'success',
        onlyBottom: true
      })
      setIsEditMode(false)
    } catch {
      resetPasswordForm()
      enqueueSnackbar('Не получилось удалить аккаунт', {
        variant: 'error',
        onlyBottom: true
      })
    }
    setIsLoading(false)
  }

  const handleUpdateEmail = async () => {
    try {
      await updateEmail(currentUser as FirebaseUser, form.email.trim())
      enqueueSnackbar('Электронная почта успешно обновлена', {
        variant: 'success',
        onlyBottom: true
      })
    } catch {
      enqueueSnackbar('Не удалось обновить адрес электронной почты', {
        variant: 'error',
        onlyBottom: true
      })
    }
  }

  const handleUpdateName = async () => {
    try {
      await updateProfile(currentUser as FirebaseUser, {
        displayName: form.displayName.trim()
      })
      enqueueSnackbar('Имя успешно обновлено', {
        variant: 'success',
        onlyBottom: true
      })
    } catch {
      enqueueSnackbar('Не удалось обновить имя', {
        variant: 'error',
        onlyBottom: true
      })
    }
  }

  const handleChangeUserData = async () => {
    setIsLoading(true)

    if (isNameChanged) {
      await handleUpdateName()
    }

    if (isEmailChanged) {
      await handleUpdateEmail()
    }

    setIsLoading(false)
    setIsEditMode(false)
  }

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formId = (event.target as HTMLFormElement).id

    if (formId === userDataFormId) {
      setIsVerifyAuthModalOpen(true)
    } else if (formId === passwordFormId) {
      await handleChangePassword()
    }
  }

  const handleSetChangePasswordMode = () => {
    setIsEditMode(true)
    setIsChangePasswordMode(true)
  }

  const handleVerifyEmail = async () => {
    setIsSendVerificationEmailLoading(true)
    try {
      await sendEmailVerification(currentUser as FirebaseUser)
      setIsVerificationEmailSent(true)
      enqueueSnackbar('Письмо успешно отправлено на электронную почту', {
        variant: 'success',
        onlyBottom: true
      })
    } catch {
      setIsSendVerificationFailed(true)
      enqueueSnackbar('Не удалось отправить письмо. Попробуйте через минуту', {
        variant: 'error',
        onlyBottom: true
      })
      timeoutId.current = setTimeout(() => {
        setIsSendVerificationFailed(false)
      }, 60000)
    }
    setIsSendVerificationEmailLoading(false)
  }

  const handleCloseConfirmUserDeletionModal = () => {
    setIsDeleteUserConfirmationModalOpen(false)
  }

  const handleCloseVerifyAuthModal = () => {
    setIsVerifyAuthModalOpen(false)
  }

  const handleChangeFormField = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }))
  }

  const handleChangePasswordFormField = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }))
  }

  return (
    <FullscreenModal
      isOpen={isOpen}
      isCloseDisabled={isLoading}
      title="Профиль"
      onClose={handleClose}
      button={
        !isEditMode ? (
          <Tooltip placement="bottom-start" title="Редактировать">
            <ButtonsWrapper>
              <IconButton color="inherit" onClick={() => setIsEditMode(true)}>
                <EditRoundedIcon />
              </IconButton>
            </ButtonsWrapper>
          </Tooltip>
        ) : (
          <ButtonsWrapper>
            <Tooltip title="Отменить">
              <IconButton
                color="inherit"
                onClick={() => setIsEditMode(false)}
                disabled={isLoading}
              >
                <BlockRoundedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip placement="bottom-start" title="Сохранить">
              <IconButton
                color="inherit"
                type="submit"
                form={isChangePasswordMode ? passwordFormId : userDataFormId}
                disabled={isLoading || isSaveButtonDisabled}
              >
                <SaveRoundedIcon />
              </IconButton>
            </Tooltip>
          </ButtonsWrapper>
        )
      }
    >
      <UI.ContentWrapper>
        <UI.Inner>
          <UI.Avatar />

          <UI.UserDataWrapper>
            {!isEditMode && (
              <>
                <div>
                  <FieldName>Электронная почта:</FieldName>
                  <FieldValue>{currentUser?.email}</FieldValue>
                </div>

                <div>
                  <FieldName>Адрес электронной почты подтвержден:</FieldName>
                  <FieldValue
                    color={
                      currentUser?.emailVerified ? colors.green[700] : 'inherit'
                    }
                    mr={currentUser?.emailVerified ? 0 : 2}
                  >
                    {currentUser?.emailVerified && 'Да'}
                    {!currentUser?.emailVerified &&
                      isVerificationEmailSent &&
                      'Нет (перезайдите в аккаунт после подтверждения по ссылке в письме)'}
                    {!currentUser?.emailVerified &&
                      !isVerificationEmailSent &&
                      'Нет'}
                  </FieldValue>
                </div>

                <div>
                  <FieldName>Имя пользователя:</FieldName>
                  <FieldValue>
                    {currentUser?.displayName || '[ не установлено ]'}
                  </FieldValue>
                </div>
                <div>
                  <FieldName>Последний вход:</FieldName>
                  <FieldValue>
                    {dayjs(currentUser!.metadata!.lastSignInTime).format(
                      'hh:mm D MMMM YYYY'
                    )}
                  </FieldValue>
                </div>
                <div>
                  <FieldName>Дата регистрации:</FieldName>
                  <FieldValue>
                    {dayjs(currentUser!.metadata!.creationTime).format(
                      'D MMMM YYYY'
                    )}
                  </FieldValue>
                </div>
                {!currentUser?.emailVerified && !isVerificationEmailSent && (
                  <UIButton
                    onClick={handleVerifyEmail}
                    disabled={
                      isSendVerificationEmailLoading || isSendVerificationFailed
                    }
                  >
                    Подтвердить электронную почту
                  </UIButton>
                )}
                <UIButton onClick={handleSetChangePasswordMode}>
                  Сменить пароль
                </UIButton>
              </>
            )}

            {isEditMode && !isChangePasswordMode && (
              <>
                <form
                  autoComplete="off"
                  id={userDataFormId}
                  onSubmit={handleSave}
                >
                  <TextField
                    autoFocus
                    required
                    label="Адрес электронной почты"
                    name="email"
                    onChange={handleChangeFormField}
                    value={form.email}
                    disabled={isLoading}
                    sx={{mb: 3}}
                  />
                  <TextField
                    label="Имя пользователя"
                    name="displayName"
                    onChange={handleChangeFormField}
                    value={form.displayName}
                    disabled={isLoading}
                  />
                </form>

                <UIButton
                  color="error"
                  onClick={() => setIsDeleteUserConfirmationModalOpen(true)}
                >
                  Удалить аккаунт
                </UIButton>
              </>
            )}

            {isEditMode && isChangePasswordMode && (
              <form
                autoComplete="off"
                id={passwordFormId}
                onSubmit={handleSave}
              >
                <TextField
                  autoFocus
                  required
                  label="Пароль"
                  name="password"
                  type="password"
                  value={passwordForm.password}
                  onChange={handleChangePasswordFormField}
                  disabled={isLoading}
                  sx={{mb: 3}}
                />
                <TextField
                  required
                  label="Новый пароль"
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handleChangePasswordFormField}
                  disabled={isLoading}
                  sx={{mb: 3}}
                />
                <TextField
                  required
                  label="Повторить новый пароль"
                  name="repeatNewPassword"
                  type="password"
                  value={passwordForm.repeatNewPassword}
                  onChange={handleChangePasswordFormField}
                  disabled={isLoading}
                />
              </form>
            )}
          </UI.UserDataWrapper>
        </UI.Inner>
      </UI.ContentWrapper>
      <ConfirmUserDeletionModal
        isOpen={isDeleteUserConfirmationModalOpen}
        onClose={handleCloseConfirmUserDeletionModal}
      />
      <VerifyAuthModal
        isOpen={isVerifyAuthModalOpen}
        onClose={handleCloseVerifyAuthModal}
        onSuccess={handleChangeUserData}
      />
    </FullscreenModal>
  )
}

export default UserProfileModal
