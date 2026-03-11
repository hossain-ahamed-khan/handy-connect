"use client";

import { Avatar, Button, Form, Input, Modal } from "antd";
import { useState } from "react";
import { IoMdHelpCircle } from "react-icons/io";
import {
  LuBell,
  LuChevronRight,
  LuGlobe,
  LuMail,
  LuMapPin,
  LuPlus,
  LuTrash2,
  LuX,
} from "react-icons/lu";

export default function Profile() {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleFinish = () => {
    setIsAddressModalOpen(false);
  };

  return (
    <div className=" bg-[#F8FAFC] py-16 lg:py-16 relative font-sans">
      {/* Top Right Help Trigger */}
      <button
        onClick={() => setIsHelpModalOpen(true)}
        className="absolute top-4 right-4 w-10 h-10 bg-[#1E293B] text-white rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors shadow-lg z-10"
      >
        <IoMdHelpCircle size={22} />
      </button>

      <div className="w-full mx-auto space-y-6">
        {/* User Profile Card */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
          <Avatar size={80} className="bg-slate-200 shrink-0" />
          <div className="flex-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Kurt Cobain
            </h1>
            <p className="text-slate-400 text-sm font-medium">
              kurt@example.com
            </p>
            <p className="text-slate-400 text-sm font-medium">
              +972 54-123-4567
            </p>
          </div>
        </div>

        {/* Settings Options */}
        <div className="space-y-4">
          <div
            onClick={() => setIsAddressModalOpen(true)}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-all group"
          >
            <div className="flex items-center gap-5">
              <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all">
                <LuMapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">
                  Saved Addresses
                </h3>
                <p className="text-slate-400 text-sm font-medium">
                  Manage your service locations
                </p>
              </div>
            </div>
            <LuChevronRight className="text-slate-300" size={24} />
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-all group">
            <div className="flex items-center gap-5">
              <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all">
                <LuBell size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">
                  Notifications
                </h3>
                <p className="text-slate-400 text-sm font-medium">On</p>
              </div>
            </div>
            <LuChevronRight className="text-slate-300" size={24} />
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-all group">
            <div className="flex items-center gap-5">
              <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all">
                <LuGlobe size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Language</h3>
                <p className="text-slate-400 text-sm font-medium">English</p>
              </div>
            </div>
            <LuChevronRight className="text-slate-300" size={24} />
          </div>
        </div>

        <div className="pt-8 flex justify-center">
          <button className="flex items-center gap-2 text-slate-400 font-bold hover:text-red-500 transition-colors border border-gray-200 px-8 py-3 rounded-2xl">
            <LuTrash2 size={18} />
            Delete Account
          </button>
        </div>
      </div>

      {/* --- Dynamic Address Modal (Matches Image Fieldsets) --- */}
      <Modal
        open={isAddressModalOpen}
        onCancel={() => setIsAddressModalOpen(false)}
        footer={null}
        closeIcon={<LuX className="text-slate-400" />}
        width={600}
      >
        <Form
          form={form}
          onFinish={handleFinish}
          layout="vertical"
          initialValues={{ addresses: [{}] }}
        >
          <Form.List name="addresses">
            {(fields, { add, remove }) => (
              <div className="space-y-12">
                {fields.map(({ key, name, ...restField }, index) => (
                  <div key={key} className="space-y-5">
                    <div className="flex justify-between items-center">
                      <h4 className="font-black text-slate-900 text-xl tracking-tight">
                        Address {index + 1}
                      </h4>
                      {fields.length > 1 && (
                        <button
                          onClick={() => remove(name)}
                          className="text-red-400 hover:text-red-600 text-sm font-bold flex items-center gap-1"
                        >
                          <LuTrash2 size={14} /> Remove
                        </button>
                      )}
                    </div>

                    {/* Matching Image Fields */}
                    <div className="space-y-3">
                      <Form.Item {...restField} name={[name, "label"]} noStyle>
                        <Input
                          placeholder="Home"
                          className="h-12 rounded-xl border-gray-200 bg-white hover:border-blue-400 focus:border-blue-500"
                        />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, "apartment"]}
                        noStyle
                      >
                        <Input
                          placeholder="Buzz apartment 4B"
                          className="h-12 rounded-xl border-gray-200 bg-white hover:border-blue-400 focus:border-blue-500"
                        />
                      </Form.Item>

                      <Form.Item {...restField} name={[name, "street"]} noStyle>
                        <Input
                          placeholder="123 Main St, Apt 4B"
                          className="h-12 rounded-xl border-gray-200 bg-white hover:border-blue-400 focus:border-blue-500"
                        />
                      </Form.Item>

                      <div className="grid grid-cols-2 gap-4">
                        <Form.Item {...restField} name={[name, "city"]} noStyle>
                          <Input
                            placeholder="New York"
                            className="h-12 rounded-xl border-gray-200 bg-white hover:border-blue-400 focus:border-blue-500"
                          />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "state"]}
                          noStyle
                        >
                          <Input
                            placeholder="California"
                            className="h-12 rounded-xl border-gray-200 bg-white hover:border-blue-400 focus:border-blue-500"
                          />
                        </Form.Item>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Form.Item {...restField} name={[name, "zip"]} noStyle>
                          <Input
                            placeholder="10001"
                            className="h-12 rounded-xl border-gray-200 bg-white hover:border-blue-400 focus:border-blue-500"
                          />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "country"]}
                          noStyle
                        >
                          <Input
                            placeholder="United States"
                            className="h-12 rounded-xl border-gray-200 bg-white hover:border-blue-400 focus:border-blue-500"
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                  <span className="text-slate-900 font-black text-lg">
                    Add Address
                  </span>
                  <button
                    type="button"
                    onClick={() => add()}
                    className="w-10 h-10 bg-slate-50 text-slate-900 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-all border border-slate-100 shadow-sm"
                  >
                    <LuPlus size={20} />
                  </button>
                </div>
              </div>
            )}
          </Form.List>

          <Button
            type="primary"
            htmlType="submit"
            block
            className="h-16 bg-[#2563eb] hover:bg-blue-700! rounded-2xl font-black text-lg mt-10 shadow-xl shadow-blue-100 border-none"
          >
            Save Changes
          </Button>
        </Form>
      </Modal>

      {/* --- Need Help Modal --- */}
      <Modal
        open={isHelpModalOpen}
        onCancel={() => setIsHelpModalOpen(false)}
        footer={null}
        closeIcon={<LuX className="text-slate-400" />}
        width={450}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-8 shadow-inner">
            <IoMdHelpCircle size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
            Need Help?
          </h2>
          <p className="text-slate-400 font-medium mb-10">
            Our support team is here for you.
          </p>
          <div className="w-full bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex items-center gap-5 mb-10 text-left">
            <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center">
              <LuMail size={24} />
            </div>
            <div>
              <p className="font-black text-slate-900">Email Us</p>
              <p className="text-slate-400 font-medium text-sm">
                support@example.com
              </p>
            </div>
          </div>
          <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest mb-8">
            Typically responds within 24 hours
          </p>
          <Button
            onClick={() => setIsHelpModalOpen(false)}
            block
            className="h-16 bg-[#2563eb] text-white font-black rounded-2xl text-lg border-none shadow-lg shadow-blue-50"
          >
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}
