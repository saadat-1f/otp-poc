"use client";

import { auth } from "../../firebase";

import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

import React, { FormEvent, useEffect, useState, useTransition } from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const OtpLogin = () => {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let timer;

    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [resendCountdown]);

  useEffect(() => {
    if (auth) {
      const recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );

      setRecaptchaVerifier(recaptchaVerifier);

      return () => {
        recaptchaVerifier.clear();
      };
    } else {
      setRecaptchaVerifier(null);
    }
  }, [auth]);

  useEffect(() => {
    const hasEnteredAllDigits = otp.length === 6;

    if (hasEnteredAllDigits) {
      verifyOtp();
    }
  }, [otp]);

  const verifyOtp = async () => {
    startTransition(async () => {
      setError("");

      if (!confirmationResult) {
        setError("Please request OTP first.");
        return;
      }

      try {
        await confirmationResult?.confirm(otp);
        router.replace("/");
        setSuccess("OTP verification successful");
      } catch (error) {
        console.log(error);
        setError("Failed to verify OTP. Please check the OTP");
      }
    });
  };

  const requestOtp = async (e) => {
    e?.preventDefault();

    setResendCountdown(60);

    startTransition(async () => {
      setError("");
      if (!recaptchaVerifier) {
        return setError("RecaptchaVerifier is not initialized");
      }

      try {
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          phoneNumber,
          recaptchaVerifier
        );

        setConfirmationResult(confirmationResult);
        setSuccess("OTP sent successfully");
      } catch (error) {
        console.log("firebase error", error);
        setResendCountdown(0);

        if (error.code === "auth/invalid-phone-number") {
          setError("Invalid phone number. Please check the number");
        } else if (error.code === "auth/too-many-requests") {
          setError("Too many requests. Please try again later");
        } else {
          setError("Failed to send OTP. Please try again ");
        }
      }
    });
  };

  return (
    <div>
      {!confirmationResult && (
        <form onSubmit={requestOtp}>
          <Input
            className="text-black"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <p className="text-xs text-gray-400 mt-2">
            Please enter your number with your country code (i.e. +91 for india)
          </p>
        </form>
      )}

      {confirmationResult && (
        <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      )}

      <Button
        disabled={!phoneNumber || isPending || resendCountdown > 0}
        onClick={() => requestOtp()}
        className="mt-5"
      >
        {resendCountdown > 0
          ? `Resend OTP in  ${resendCountdown}`
          : isPending
          ? "Sending OTP"
          : "Send OTP"}
      </Button>

      <div className="p-10 text-center">
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </div>

      <div id="recaptcha-container"></div>
    </div>
  );
};

export default OtpLogin;
