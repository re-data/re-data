def get_domain_and_subdomain(domain: str):
    """
    Returns the subdomain and the parent domain.
    """

    parts = domain.split('.')
    if len(parts) < 2:
        raise Exception(f'No TLD found on ${domain}')
    if len(parts) == 2:
        return '', domain
    subdomain = parts[0]
    parts.pop(0)
    return subdomain, '.'.join(parts) + '.'
