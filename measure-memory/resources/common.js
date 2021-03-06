const SAME_ORIGIN = {origin: get_host_info().HTTPS_ORIGIN, name: "SAME_ORIGIN"};
const CROSS_ORIGIN = {origin: get_host_info().HTTPS_NOTSAMESITE_ORIGIN, name: "CROSS_ORIGIN"}

function checkMeasureMemoryBreakdown(breakdown, options) {
  let allowed = new Set(options.allowed);
  assert_own_property(breakdown, 'bytes');
  assert_greater_than_equal(breakdown.bytes, 0);
  assert_own_property(breakdown, 'userAgentSpecificType');
  for (let userAgentSpecificType of breakdown.userAgentSpecificType) {
    assert_equals(typeof userAgentSpecificType, 'string');
  }
  assert_own_property(breakdown, 'attribution');
  for (let attribution of breakdown.attribution) {
    assert_equals(typeof attribution, 'string');
    assert_true(
        allowed.has(attribution),
        `${attribution} must be in ${JSON.stringify(options.allowed)}`);
  }
}

function checkMeasureMemory(result, options) {
    assert_own_property(result, 'bytes');
    assert_own_property(result, 'breakdown');
    let bytes = 0;
    for (let breakdown of result.breakdown) {
      checkMeasureMemoryBreakdown(breakdown, options);
      bytes += breakdown.bytes;
    }
    assert_equals(bytes, result.bytes);
}

function getUrl(host, relativePath) {
  const path = new URL(relativePath, window.location).pathname;
  return `${host.origin}/${path}`;
}