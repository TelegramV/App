const CountryDropdownItemComponent = ({flag, name, code}) => {
    return <div className="dropdown-item">
        <div className="country-flag">{flag}</div>
        <div className="country-name">{name}</div>
        <div className="country-code">{code}</div>
    </div>
}

export default CountryDropdownItemComponent;