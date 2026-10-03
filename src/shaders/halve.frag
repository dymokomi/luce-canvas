// A coarser pyramid tile: one quarter of the output from one finer tile, each
// output texel the average of the 2x2 finer texels under it, in premultiplied
// space so soft edges keep their color (a straight average darkens them).
// Finer texels past what the tile covers count as `empty`: transparent for a
// layer, white for a mask. The output is straight alpha, like every tile.
#version 450
layout(location = 0) in vec4 vertex_color;
layout(location = 0) out vec4 fragment_color;
layout(push_constant) uniform Params {
    vec2 origin;   // the quarter's top-left in the output
    vec2 covered;  // the finer tile's covered texels
    float white;   // 1: empty is white (a mask)
} params;
layout(set = 0, binding = 1) uniform sampler2D finer;

void main() {
    ivec2 base = ivec2(floor(gl_FragCoord.xy - params.origin)) * 2;
    vec4 empty = params.white > 0.5 ? vec4(1.0) : vec4(0.0);
    vec3 rgb = vec3(0.0);
    float alpha = 0.0;
    for (int dy = 0; dy < 2; dy++) {
        for (int dx = 0; dx < 2; dx++) {
            ivec2 at = base + ivec2(dx, dy);
            vec4 texel = (float(at.x) < params.covered.x && float(at.y) < params.covered.y) ? texelFetch(finer, at, 0) : empty;
            rgb += texel.rgb * texel.a;
            alpha += texel.a;
        }
    }
    fragment_color = alpha > 0.0 ? vec4(rgb / alpha, alpha * 0.25) : vec4(0.0);
}
