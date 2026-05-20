"use client";

import { Button, Form, Input, message, Spin, Switch, Upload } from "antd";
import type { UploadProps } from "antd";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LuArrowRight,
  LuCalculator,
  LuFileSearch,
  LuMapPin,
  LuScan,
  LuUpload,
  LuUserCheck,
} from "react-icons/lu";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  useAiDiagnosisQuery,
  useFinalRequestSubmissionMutation,
  useInitiateServiceRequestMutation,
  useUploadMediaMutation,
} from "@/redux/features/customer/serviceRequest/serviceRequestApi";
import AIDiagnosis, {
  AiDiagnosisResponse,
} from "@/components/user/AiDiagonosisResult";

const { TextArea } = Input;

type ServiceDetails = {
  id: number;
  name_en: string;
  name_de: string;
  icon: string;
  color: string;
  min_price: string;
  max_price: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type ServiceRequestResponse = {
  id: number;
  customer: number;
  customer_name: string;
  customer_photo: string | null;
  service: number;
  service_name: string;
  service_details: ServiceDetails;
  service_icon: string;
  description: string | null;
  ai_summary: string | null;
  ai_cost: Record<string, unknown>;
  address: string | null;
  zip_code: string | null;
  phone_number: string;
  no_call_just_chat: boolean;
  mark_as_priority: boolean;
  status: string;
  status_display: string;
  total_price: string;
  lat: number | null;
  lng: number | null;
  media: Array<unknown>;
  is_sold: boolean;
  application_count: number;
  is_applied: boolean;
  assigned_provider: number | null;
  assigned_provider_details: unknown;
  created_at: string;
  updated_at: string;
  formatted_date: string;
  timeline: {
    request_received: string;
    on_the_way: string | null;
    in_progress: string | null;
    completed: string | null;
  };
};

export const dynamicParams = true;

export default function ServiceDetails() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [serviceRequest, setServiceRequest] =
    useState<ServiceRequestResponse | null>(null);
  const [aiResult, setAiResult] = useState<AiDiagnosisResponse | null>(null);
  const [aiRequestId, setAiRequestId] = useState<number | null>(null);
  const [zipCode, setZipCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [markAsPriority, setMarkAsPriority] = useState(false);
  const [coords, setCoords] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });
  const [locationError, setLocationError] = useState(false);
  const [pollingActive, setPollingActive] = useState(false);

  const [initiateServiceRequest] = useInitiateServiceRequestMutation();
  const [uploadMedia] = useUploadMediaMutation();
  const [finalRequestSubmission, { isLoading: isSubmitting }] =
    useFinalRequestSubmissionMutation();

  const { data: aiResultData } = useAiDiagnosisQuery(
    aiRequestId ? { requestId: aiRequestId } : skipToken,
    { pollingInterval: pollingActive ? 5000 : 0 }
  );

  const serviceDetails = serviceRequest?.service_details ?? null;

  // Auto-fetch geolocation on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setLocationError(true);
      }
    );
  }, []);

  useEffect(() => {
    const serviceId = Number(id) || 1;
    initiateServiceRequest({ service: serviceId })
      .unwrap()
      .then((response) => {
        setServiceRequest(response as ServiceRequestResponse);
      })
      .catch((error) => {
        console.error("Failed to initiate service request", error);
      });
  }, [id, initiateServiceRequest]);

  useEffect(() => {
    form.setFieldsValue({ category: serviceDetails?.name_en || "N/A" });
  }, [form, serviceDetails?.name_en]);

  useEffect(() => {
    if (aiResultData?.status === "completed") {
      setAiResult(aiResultData as AiDiagnosisResponse);
    }
  }, [aiResultData]);

  // Polling: RTK Query handles refetching every 5s while active
  useEffect(() => {
    if (aiResultData?.status === "completed") {
      setPollingActive(false);
    }
  }, [aiResultData]);

  const handleSendRequest = async () => {
    if (!serviceRequest?.id) {
      messageApi.error("Please wait for the request to initialize.");
      return;
    }

    setAiResult(null);

    try {
      const payload = {
        description: form.getFieldValue("description")?.trim() || "pipe broken",
        lat: coords.lat,
        lng: coords.lng,
        address: "Dhaka",
        zip_code: zipCode ? Number(zipCode) : 1212,
        phone_number: phoneNumber || null,
        no_call_just_chat: true,
        mark_as_priority: markAsPriority,
        status: "PENDING",
      };

      console.log("Submitting request with payload:", payload);

      const finalResponse = await finalRequestSubmission({
        requestId: serviceRequest.id,
        formData: payload,
      }).unwrap();

      setAiRequestId(finalResponse.id);
      setPollingActive(true);
    } catch (error) {
      console.error("Failed to submit request or run AI diagnosis.", error);
      messageApi.error("Failed to submit request or run AI diagnosis.");
    }
  };

  const steps = [
    { id: 1, label: "Scanning uploaded media", icon: <LuScan /> },
    { id: 2, label: "Identifying the issue", icon: <LuFileSearch /> },
    { id: 3, label: "Estimating repair costs", icon: <LuCalculator /> },
    { id: 4, label: "Matching professionals", icon: <LuUserCheck /> },
  ];

  const handleMediaUpload: UploadProps["customRequest"] = async (options) => {
    const { file, onError, onSuccess } = options;

    if (!serviceRequest?.id) {
      messageApi.error("Please wait for the request to initialize.");
      onError?.(new Error("Service request is not ready."));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("request", String(serviceRequest.id));
      formData.append("file", file as File);

      await uploadMedia(formData).unwrap();
      messageApi.success("Media uploaded successfully.");
      onSuccess?.("ok");
    } catch (error) {
      messageApi.error("Failed to upload media.");
      onError?.(error as Error);
    }
  };

  if (aiResult && aiResultData?.status === "completed") {
    return (
      <>
        {contextHolder}
        <AIDiagnosis
          result={aiResult}
          isLoading={false}
          requestId={aiRequestId}
          onBack={() => setAiResult(null)}
        />
      </>
    );
  }

  const isAiLoading = pollingActive && aiResultData?.status !== "completed";

  if (isAiLoading) {
    return (
      <>
        {contextHolder}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-bold text-gray-900">
                Analyzing your request
              </p>
              <p className="text-xs text-gray-400 mt-1">
                This usually takes under a minute.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              AI Processing
            </span>
          </div>
          <div className="flex items-center justify-center py-6">
            <Spin size="large" />
          </div>
          <div className="mt-8 space-y-5">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  {step.icon}
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {contextHolder}
      <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Section */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-8 text-gray-900">
              Service Details
            </h2>

            <Form form={form} layout="vertical" requiredMark={false}>
              <Form.Item
                label={
                  <span className="font-bold text-gray-600 text-sm">
                    Service Category
                  </span>
                }
                name="category"
              >
                <Input
                  placeholder="Service category"
                  size="large"
                  className="w-full h-12 rounded-xl"
                  disabled
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="font-bold text-gray-600 text-sm">
                    Problem Description
                  </span>
                }
                name="description"
              >
                <TextArea
                  rows={5}
                  placeholder="Describe the issue in detail..."
                  className="rounded-2xl border-gray-200 p-4 text-sm"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="font-bold text-gray-600 text-sm">
                    Upload Media
                  </span>
                }
              >
                <Upload.Dragger
                  className="bg-[#FAFBFF] border-dashed border-2 border-blue-100 rounded-3xl py-12"
                  customRequest={handleMediaUpload}
                  multiple
                >
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
                      <LuUpload size={32} />
                    </div>
                    <p className="font-bold text-gray-800 text-lg">
                      Click to upload or drag and drop
                    </p>
                  </div>
                </Upload.Dragger>
              </Form.Item>
            </Form>
          </div>

          {/* Location & Urgency */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-8 text-gray-900">
              Location & Urgency
            </h2>
            <div className="space-y-8">
              <div>
                <p className="font-bold text-gray-600 text-sm mb-3">Zip Code</p>
                <Input
                  placeholder="e.g. 10001"
                  size="large"
                  className="h-12 rounded-xl bg-gray-50 border-gray-100"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
              </div>

              <div>
                <p className="font-bold text-gray-600 text-sm mb-3">
                  Phone Number
                </p>
                <Input
                  placeholder="e.g. +49 123 456789"
                  size="large"
                  className="h-12 rounded-xl bg-gray-50 border-gray-100"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              {/* Geolocation display */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="p-2 bg-blue-50 text-blue-500 rounded-xl">
                  <LuMapPin size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-700 text-sm">
                    Your Location
                  </p>
                  {coords.lat && coords.lng ? (
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                    </p>
                  ) : locationError ? (
                    <p className="text-xs text-red-400 font-medium mt-0.5">
                      Location access denied — coordinates will not be sent
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400 font-medium mt-0.5 animate-pulse">
                      Fetching location…
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="bg-red-50 p-3 rounded-xl text-red-500 text-xl">
                    ⚠️
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Emergency Service</p>
                    <p className="text-gray-400 text-xs">
                      Immediate assistance within 2 hours
                    </p>
                  </div>
                </div>
                <Switch
                  checked={markAsPriority}
                  onChange={(checked) => setMarkAsPriority(checked)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-50 sticky top-6">
            <h2 className="text-xl font-bold mb-8 text-gray-900">
              Request Summary
            </h2>

            <div className="space-y-5 mb-8 border-b border-gray-50 pb-8">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-medium">Category</span>
                <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg capitalize">
                  {serviceDetails?.name_en || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-medium">Urgency</span>
                <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                  {markAsPriority ? "Emergency" : "Standard"}
                </span>
              </div>
              {coords.lat && coords.lng && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-medium">Location</span>
                  <span className="font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs">
                    GPS detected
                  </span>
                </div>
              )}
            </div>

            <div className="bg-orange-50/50 p-6 rounded-2xl mb-8 border border-orange-100/50">
              <p className="font-bold text-orange-900 mb-5 text-sm uppercase tracking-wider">
                Process flow
              </p>
              <div className="space-y-6">
                {[
                  "Professionals are notified.",
                  "Receive quotes in minutes.",
                  "Compare and hire the best.",
                ].map((text, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <span className="w-6 h-6 rounded-full bg-orange-400 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-xs font-bold text-gray-700 leading-tight">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Button
              block
              onClick={handleSendRequest}
              loading={isSubmitting || pollingActive}
              disabled={!serviceRequest?.id}
              className="h-24 bg-[#F59E0B] text-white border-none font-bold text-2xl rounded-2xl flex items-center justify-center gap-2 shadow-xl transition-all hover:-translate-y-1 active:scale-95"
            >
              Send Request <LuArrowRight />
            </Button>

            <p className="text-center text-[11px] text-gray-400 mt-6 font-medium">
              No payment is required to post a request.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}