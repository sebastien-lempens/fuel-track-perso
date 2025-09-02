interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: React.ReactNode;
}

const InputField: React.FC<InputProps> = ({ label, icon, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-2">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {icon}
            </div>
            <input
                id={id}
                className="bg-base-300 border border-base-300 text-text-primary placeholder-gray-500 text-sm rounded-lg focus:ring-brand-secondary focus:border-brand-secondary block w-full pl-10 p-2.5 transition duration-200"
                {...props}
            />
        </div>
    </div>
);
export { InputField}