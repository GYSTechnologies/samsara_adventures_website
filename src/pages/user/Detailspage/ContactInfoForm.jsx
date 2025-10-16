import React from "react";
import { ChevronUp, Mail, User, Plus, Minus, Shield } from "lucide-react";

const ContactInfoForm = ({ formData, onFormChange, onCounterChange, onSubmit, loading, tripData }) => {
  const totalGuests = (formData.adults || 0) + (formData.children || 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img src={tripData.images?.[0]} alt={tripData.title} className="w-16 h-16 rounded-lg object-cover" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm">{tripData.title}</h3>
            <p className="text-xs text-gray-600">{tripData.state}</p>
            <p className="text-xs text-gray-600">{tripData.duration}</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 text-xs">Date</span>
            <p className="font-medium text-gray-900 text-sm">
              {new Date(tripData.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              {' - '}
              {new Date(tripData.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div>
            <span className="text-gray-600 text-xs">Guests</span>
            <p className="font-medium text-gray-900 text-sm">
              {totalGuests} Adult{totalGuests !== 1 ? 's' : ''}
              {formData.children > 0 ? ` and ${formData.children} Child${formData.children !== 1 ? 'ren' : ''}` : ''}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
          <Shield size={12} />
          <span>Free cancellation before January 15</span>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm">Total (USD)</span>
          <div className="text-right">
            <span className="text-xl font-bold text-gray-900">${tripData.payment?.grandTotal?.toLocaleString() || '1,050'}</span>
            <ChevronUp size={16} className="text-gray-400 ml-1 inline" />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Contact Details</h3>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Full Name *</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" value={formData.fullName} onChange={(e) => onFormChange('fullName', e.target.value)} placeholder="john christian" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Email *</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="email" value={formData.email} onChange={(e) => onFormChange('email', e.target.value)} placeholder="john.christian@gmail.com" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Phone Number *</label>
          <input type="tel" value={formData.phone} onChange={(e) => onFormChange('phone', e.target.value)} placeholder="845606434" className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent" />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="sms-updates" className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
          <label htmlFor="sms-updates" className="text-sm text-gray-600">Receive SMS updates about your booking. Message rates may apply.</label>
        </div>
      </div>

      <div className="p-4 space-y-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900">Guests</h4>

        {['adults', 'children', 'infants'].map((type) => (
          <div key={type} className="flex justify-between items-center">
            <div>
              <span className="text-sm font-medium text-gray-900 capitalize">{type}</span>
              <p className="text-xs text-gray-600">{type === 'adults' ? 'Ages 18 or above' : type === 'children' ? 'Ages 12-17' : 'Under 2'}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => onCounterChange(type, 'decrement')} disabled={(type === 'adults' ? formData.adults <= 1 : (formData[type] || 0) <= 0)} className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center disabled:bg-gray-300">
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-medium">{formData[type] || 0}</span>
              <button onClick={() => onCounterChange(type, 'increment')} className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                <Plus size={16} />
              </button>
            </div>
          </div>
        ))}

        {Array.from({ length: (formData.adults || 0) + (formData.children || 0) }, (_, index) => (
          <div key={index} className="bg-gray-50 p-3 rounded-lg">
            <h5 className="text-sm font-medium text-gray-900 mb-3">Traveler {index + 1}</h5>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input type="text" placeholder={index === 0 ? 'Micheal Schofield' : `Traveler ${index + 1}`} className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-green-500 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Birth Date *</label>
                <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-green-500 focus:border-transparent" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button onClick={onSubmit} disabled={loading || !formData.email || !formData.phone || !formData.fullName} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
          {loading ? 'Processing...' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default ContactInfoForm;