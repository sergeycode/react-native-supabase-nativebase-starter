import { useState, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import { StatusBar, useColorMode } from 'native-base';
import { supabase } from '../lib/initSupabase';
import {
  Center,
  Heading,
  VStack,
  HStack,
  Text,
  Icon,
  FormControl,
  WarningOutlineIcon,
} from 'native-base';
import { FontAwesome5 } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { PrimaryButton, LinkButton } from './UI/Button';
import { PrimaryInput } from './UI/Input';

const FormSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .matches(/\w*[a-z]\w*/, 'Password must have a small letter')
    .matches(/\w*[A-Z]\w*/, 'Password must have a capital letter')
    .matches(/\d/, 'Password must have a number')
    .matches(
      /[!@#$%^&*()\-_"=+{}; :,<.>]/,
      'Password must have a special character'
    )
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .required('Password is required'),
});

export default function Auth() {
  const [passShow, setPassShow] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showOtp, setShowOtp] = useState<boolean>(false);
  const [otpEmail, setOtpEmail] = useState<string>('');
  const mountedRef = useRef(true);

  const handleLogin = async (type: string, email: string, password: string) => {
    // if email exists
    if (type === 'SIGNUP') {
      try {
        const { data, error, status } = await supabase
          .from('profiles')
          .select(`email`)
          .eq('email', email)
          .single();

        if (error && status !== 406) {
          Alert.alert(error.message);
          throw error;
        }

        if (data) {
          Alert.alert(
            'Email already exists. If you have not finished entering token, login and enter the token.'
          );
          return;
        }
      } catch (error: any) {
        Alert.alert(error.message);
        throw error;
      }
    }

    const { error, user } =
      type === 'LOGIN'
        ? await supabase.auth.signIn({ email, password })
        : await supabase.auth.signUp({ email, password });
    if (!error && !user) Alert.alert('Check your email for the code');
    // if (error) Alert.alert(error.message);
    if (error) {
      Alert.alert(error.message);
    } else {
      // verify OTP
      setShowOtp(true);
      setOtpEmail(email);
    }
  };

  const handleToken = async (email: string, token: string) => {
    // submit OTP token with email
    const { session, error } = await supabase.auth.verifyOTP({
      email,
      token,
      type: 'signup',
    });
    if (error) Alert.alert(error.message);
  };

  const { colorMode } = useColorMode();

  useEffect(() => {
    // cleanup
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <>
      <StatusBar
        barStyle={colorMode === 'dark' ? 'light-content' : 'dark-content'}
      />
      {!showOtp && (
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={FormSchema}
          onSubmit={values =>
            handleLogin(
              showLogin ? 'LOGIN' : 'SIGNUP',
              values.email,
              values.password
            )
          }
        >
          {({
            errors,
            touched,
            isSubmitting,
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            isValid,
          }) => (
            <Center
              _dark={{ bg: 'dark.100' }}
              _light={{ bg: 'blueGray.50' }}
              px={4}
              flex={1}
            >
              <VStack space={5} alignItems="center" w="100%">
                <Heading>{showLogin ? 'Login' : 'Sign Up'}</Heading>
                <FormControl
                  isInvalid={'email' in errors && touched.email}
                  maxW="100%"
                >
                  <PrimaryInput
                    type="text"
                    placeholder="Email"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    error={errors.email}
                    touched={touched.email}
                    InputLeftElement={
                      <Icon
                        as={<FontAwesome5 name="user" />}
                        size={5}
                        ml="5"
                        _dark={{
                          color: 'gray.500',
                        }}
                        _light={{ color: 'gray.900' }}
                      />
                    }
                  />
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {errors.email}
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={'password' in errors && touched.password}
                  maxW="100%"
                >
                  <PrimaryInput
                    type={passShow ? 'text' : 'password'}
                    placeholder="Password"
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    error={errors.password}
                    touched={touched.password}
                    InputLeftElement={
                      <Icon
                        as={<FontAwesome5 name="lock" />}
                        size={5}
                        ml="5"
                        _dark={{
                          color: 'gray.500',
                        }}
                        _light={{ color: 'gray.900' }}
                      />
                    }
                    InputRightElement={
                      <Icon
                        as={
                          <FontAwesome5 name={passShow ? 'eye' : 'eye-slash'} />
                        }
                        size={5}
                        mr="5"
                        minWidth="6"
                        _dark={{
                          color: 'gray.500',
                        }}
                        _light={{ color: 'gray.900' }}
                        onPress={() => setPassShow(!passShow)}
                      />
                    }
                  />
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    {errors.password}
                  </FormControl.ErrorMessage>
                </FormControl>
                <PrimaryButton
                  isDisabled={isSubmitting || !isValid}
                  isLoading={isSubmitting}
                  isLoadingText="Submitting"
                  onPress={() => handleSubmit()}
                  onSubmitEditing={() => handleSubmit()}
                >
                  {showLogin ? 'Login' : 'Sign Up'}
                </PrimaryButton>
                <HStack alignItems="center">
                  <Text>
                    {showLogin
                      ? "Don't have an account yet?"
                      : 'Already have an account?'}
                  </Text>
                  <LinkButton onPress={() => setShowLogin(!showLogin)}>
                    {showLogin ? 'Sign Up' : 'Login'}
                  </LinkButton>
                </HStack>
                {!showLogin && (
                  <Text>
                    Password must have a small letter, a capital letter, a
                    number, must have a special character and min. 8 characters
                    long
                  </Text>
                )}
              </VStack>
            </Center>
          )}
        </Formik>
      )}
      {showOtp && (
        <Center
          _dark={{
            bg: 'dark.100',
          }}
          _light={{ bg: 'blueGray.50' }}
          px={4}
          flex={1}
        >
          <Formik
            initialValues={{
              token: '',
            }}
            validationSchema={Yup.object().shape({
              token: Yup.string().required('Token is required'),
            })}
            onSubmit={values => handleToken(otpEmail, values.token)}
          >
            {({
              errors,
              touched,
              isSubmitting,
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              isValid,
            }) => (
              <Center
                _dark={{
                  bg: 'dark.100',
                }}
                _light={{ bg: 'blueGray.50' }}
                px={4}
                flex={1}
              >
                <VStack space={5} alignItems="center">
                  <Heading>Enter Token</Heading>
                  <FormControl
                    isInvalid={'token' in errors && touched.token}
                    maxW="100%"
                  >
                    <PrimaryInput
                      type="text"
                      placeholder="Token"
                      onChangeText={handleChange('token')}
                      onBlur={handleBlur('token')}
                      value={values.token}
                      error={errors.token}
                      touched={touched.token}
                      InputLeftElement={
                        <Icon
                          as={<FontAwesome5 name="keyboard" />}
                          size={5}
                          ml="5"
                          _dark={{
                            color: 'gray.500',
                          }}
                          _light={{ color: 'gray.900' }}
                        />
                      }
                    />
                    <FormControl.ErrorMessage
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      {errors.token}
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <PrimaryButton
                    isDisabled={isSubmitting || !isValid}
                    isLoading={isSubmitting}
                    isLoadingText="Submitting"
                    onPress={() => handleSubmit()}
                    onSubmitEditing={() => handleSubmit()}
                  >
                    Submit
                  </PrimaryButton>
                  <Text>
                    Check your email for the token. It will expire in 1 hour.
                  </Text>
                  <LinkButton onPress={() => setShowOtp(false)}>
                    Go back to Sign Up
                  </LinkButton>
                </VStack>
              </Center>
            )}
          </Formik>
        </Center>
      )}
    </>
  );
}
